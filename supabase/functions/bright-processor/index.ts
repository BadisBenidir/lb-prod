import Stripe from 'https://esm.sh/stripe@14.23.0?target=deno&no-check'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const supabase = createClient(Deno.env.get('SUPABASE_URL') || '', Deno.env.get('SERVICE_ROLE_KEY') || '')

    const body = await req.json()
    
    // 1. GESTION DES MONTANTS (On repasse tout en EUROS pour la base de données)
    const subtotal = body.subtotal || 0;
    const shippingCost = body.shipping || 0;
    const totalAmount = subtotal + shippingCost;

    const orderNumber = `OZ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 2. CRÉATION DE LA COMMANDE (Table orders)
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert([{
        order_number: orderNumber,
        customer_id: body.userId || null,
        email: body.customerEmail,
        total_amount: totalAmount, // ✅ Ici on enregistre 101.00, PAS 10100
        subtotal: subtotal,
        shipping_cost: shippingCost,
        currency: 'EUR',
        status: 'pending',
        payment_status: 'pending',
        shipping_address: {
          full_name: body.customer_name,
          address: body.shippingAddress.address,
          city: body.shippingAddress.city,
          postcode: body.shippingAddress.zipCode || body.shippingAddress.postalCode,
          phone: body.shippingAddress.phone,
          shipping_method: body.delivery_method // ✅ "Point Relais" ou "Domicile"
        }
      }])
      .select().single()

    if (dbError) throw dbError;

    // 3. ENREGISTREMENT DES ARTICLES (Table order_items)
    const orderItems = body.cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity, // ✅ Nom exact de ta colonne
      product_snapshot: {
        name: item.name,
        image: item.image,
        brand: item.brand
      }
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;

    // 4. CRÉATION STRIPE (On multiplie par 100 UNIQUEMENT ICI pour Stripe)
    const lineItems = body.cartItems.map((item: any) => ({
      price_data: {
        currency: 'eur',
        unit_amount: Math.round(item.price * 100),
        product_data: { name: item.name, images: [item.image] },
      },
      quantity: item.quantity,
    }));

    // Ajout des frais de port dans Stripe
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(shippingCost * 100),
          product_data: { name: 'Frais de livraison' },
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: body.success_url || `${req.headers.get('origin')}/success`,
      cancel_url: body.cancel_url || `${req.headers.get('origin')}/cart`,
      customer_email: body.customerEmail,
      metadata: { order_id: order.id }
    })

    return new Response(JSON.stringify({ id: session.id }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 })
  }
})