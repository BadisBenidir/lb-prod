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
    
    const email = body.customerEmail;
    const subtotal = Number(body.subtotal) || 0;
    const shippingCost = Number(body.shipping) || 0;
    const totalAmount = subtotal + shippingCost;

    // 1. CRÉATION DE LA COMMANDE (Table orders)
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert([{
        order_number: `OZ-${Date.now().toString().slice(-6)}`,
        customer_id: body.userId,
        email: email,
        total_amount: totalAmount, // ✅ Enregistre ex: 101.00 (Pas 10100)
        subtotal: subtotal,
        shipping_cost: shippingCost,
        shipping_method: body.delivery_method, // ✅ Pour l'admin
        status: 'pending',
        payment_status: 'pending',
        shipping_address: {
          full_name: body.customer_name,
          address: body.shippingAddress.address,
          city: body.shippingAddress.city,
          postcode: body.shippingAddress.postalCode || body.shippingAddress.zipCode,
          phone: body.shippingAddress.phone
        }
      }])
      .select().single()

    if (dbError) throw dbError;

    // 2. CRÉATION DES ARTICLES (C'est ça qui remplit ta liste Admin)
    const orderItems = body.cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      line_total: item.price * item.quantity, // ✅ Ta colonne line_total
      product_snapshot: { // ✅ Ce que l'admin affiche (Image + Nom)
        name: item.name,
        image: item.image,
        brand: item.brand
      }
    }));

    await supabase.from('order_items').insert(orderItems);

    // 3. SESSION STRIPE
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: body.cartItems.map((item: any) => ({
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(item.price * 100), // Uniquement ici pour Stripe
          product_data: { name: item.name, images: [item.image] },
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success`,
      cancel_url: `${req.headers.get('origin')}/cart`,
      customer_email: email,
      metadata: { order_id: order.id }
    })

    return new Response(JSON.stringify({ id: session.id }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 })
  }
})