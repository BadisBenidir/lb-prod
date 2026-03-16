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

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SERVICE_ROLE_KEY') || '' 
    )

    const body = await req.json()

    if (body.sessionId) {
      const session = await stripe.checkout.sessions.retrieve(body.sessionId)
      return new Response(JSON.stringify({ status: session.status }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    const orderNumber = `OZ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Calcul des montants
    const subtotal = body.items.reduce((acc: number, item: any) => {
      return acc + (item.price_data.unit_amount * item.quantity);
    }, 0) / 100;

    const shippingCost = body.shipping_cost || 0;
    const totalAmount = subtotal + shippingCost;

    // --- SAUVEGARDE DANS L'ADMIN ---
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert([{
        order_number: orderNumber,
        email: body.customer_email,
        subtotal: subtotal,
        shipping_cost: shippingCost,
        total_amount: totalAmount,
        currency: 'EUR',
        status: 'pending',
        payment_status: 'pending', // ✅ Changé de 'unpaid' à 'pending' pour passer la sécurité
        shipping_address: {
          name: `${body.customer_name}`,
          line1: body.address,
          city: body.city,
          postal_code: body.zip_code,
          phone: body.phone
        }
      }])
      .select()

    if (dbError) throw new Error(`Erreur Admin: ${dbError.message}`);

    // --- CRÉATION SESSION STRIPE ---
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: body.items,
      mode: 'payment',
      success_url: body.success_url,
      cancel_url: body.cancel_url,
      customer_email: body.customer_email,
      metadata: { order_id: order[0].id }
    })

    return new Response(JSON.stringify({ id: session.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("Erreur détectée:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})