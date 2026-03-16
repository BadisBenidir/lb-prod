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

    // On utilise SERVICE_ROLE_KEY (celui que tu viens de réussir à set !)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SERVICE_ROLE_KEY') || '' 
    )

    const body = await req.json()

    // --- CAS 1 : VÉRIFICATION SESSION ---
    if (body.sessionId) {
      const session = await stripe.checkout.sessions.retrieve(body.sessionId)
      return new Response(JSON.stringify({ status: session.status }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    // --- CAS 2 : CRÉATION COMMANDE + STRIPE ---
    const orderNumber = `OZ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // A. SAUVEGARDE DANS L'ADMIN (Table orders)
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert([{
        order_number: orderNumber,
        email: body.customer_email,
        total_amount: body.total_amount, // Assure-toi que ton site envoie ce chiffre
        status: 'pending',
        payment_status: 'unpaid',
        shipping_address: {
          name: body.customer_name,
          line1: body.address,
          city: body.city,
          postal_code: body.zip_code,
          phone: body.phone
        }
      }])
      .select()

    if (dbError) throw new Error(`Erreur Admin: ${dbError.message}`);

    // B. CRÉATION SESSION STRIPE
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
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})