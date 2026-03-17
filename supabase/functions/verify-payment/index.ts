import Stripe from 'https://esm.sh/stripe@14.23.0?target=deno'
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
      httpClient: Stripe.createFetchHttpClient(), // Indispensable pour éviter l'erreur runMicrotasks
    })
    const supabase = createClient(Deno.env.get('SUPABASE_URL') || '', Deno.env.get('SERVICE_ROLE_KEY') || '')

    const { session_id } = await req.json()
    
    // 1. On récupère la session chez Stripe pour être sûr que c'est payé
    const session = await stripe.checkout.sessions.retrieve(session_id)
    
    if (session.payment_status === 'paid') {
      const orderId = session.metadata?.order_id

      // 2. On met à jour la commande dans l'Admin
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'paid',
          status: 'processing' 
        })
        .eq('id', orderId)

      if (updateError) throw updateError

      return new Response(JSON.stringify({ success: true }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })
    }

    throw new Error("Le paiement n'a pas été validé par Stripe")

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 400 
    })
  }
})