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
    const customerEmail = body.customer_email || body.email || (body.customerDetails && body.customerDetails.email);
    const details = body.customerDetails || body;
    const orderNumber = `OZ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Calculs
    const subtotal = body.items.reduce((acc: number, item: any) => acc + (item.price_data.unit_amount * item.quantity), 0) / 100;
    const shippingCost = body.shipping_cost || 0;
    const totalAmount = subtotal + shippingCost;

    // 1. CRÉATION DE LA COMMANDE
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert([{
        order_number: orderNumber,
        email: customerEmail,
        subtotal: subtotal,
        shipping_cost: shippingCost,
        total_amount: totalAmount,
        currency: 'EUR',
        status: 'pending',
        payment_status: 'pending',
        shipping_address: {
          name: details.customer_name || `${details.firstName} ${details.lastName}`,
          address: details.address || details.line1,
          city: details.city,
          postcode: details.zip_code || details.zipCode,
          phone: details.phone,
          // ✅ AJOUT DU MODE DE LIVRAISON ICI
          shipping_method: body.delivery_method || "Livraison à domicile" 
        }
      }])
      .select()
      .single()

    if (dbError) throw new Error(`Erreur Commande: ${dbError.message}`);

    // 2. ENREGISTREMENT DES ARTICLES
    const orderItems = body.items.map((item: any) => ({
      order_id: order.id,
      quantity: item.quantity,
      unit_price: item.price_data.unit_amount / 100,
      total_price: (item.price_data.unit_amount * item.quantity) / 100, // ✅ CORRIGÉ : Nom exact de ta colonne
      product_snapshot: {
        name: item.price_data.product_data.name,
        image: item.price_data.product_data.images?.[0] || null
      }
    }));

    await supabase.from('order_items').insert(orderItems);

    // 3. SESSION STRIPE
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: body.items,
      mode: 'payment',
      success_url: body.success_url,
      cancel_url: body.cancel_url,
      customer_email: customerEmail,
      metadata: { order_id: order.id }
    })

    return new Response(JSON.stringify({ id: session.id }), { headers: corsHeaders })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 400 })
  }
})