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
    
    // 🛡️ RECHERCHE DE L'EMAIL (On fouille partout)
    const email = body.customerEmail || body.email || body.shippingAddress?.email;
    if (!email) throw new Error("Email manquant dans la requête");

    const subtotal = Number(body.subtotal) || 0;
    const shippingCost = Number(body.shipping) || 0;
    const totalAmount = subtotal + shippingCost;

    // 1. COMMANDE
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert([{
        order_number: `OZ-${Date.now().toString().slice(-6)}`,
        email: email,
        total_amount: totalAmount, 
        subtotal: subtotal,
        shipping_cost: shippingCost,
        status: 'pending',
        payment_status: 'pending',
        shipping_address: {
          full_name: body.customer_name || "Client",
          address: body.shippingAddress?.address || "",
          city: body.shippingAddress?.city || "",
          postcode: body.shippingAddress?.zipCode || body.shippingAddress?.postalCode || "",
          shipping_method: body.delivery_method || "Standard"
        }
      }])
      .select().single()

    if (dbError) throw dbError;

    // 2. ARTICLES (Utilise line_total de ton image 133601)
    if (body.cartItems) {
      const orderItems = body.cartItems.map((item: any) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: Number(item.price),
        line_total: Number(item.price) * item.quantity,
        product_snapshot: { name: item.name, image: item.image }
      }));
      await supabase.from('order_items').insert(orderItems);
    }

    // 3. STRIPE
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: body.cartItems.map((item: any) => ({
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(Number(item.price) * 100),
          product_data: { name: item.name, images: item.image ? [item.image] : [] },
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