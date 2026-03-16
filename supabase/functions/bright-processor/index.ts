import Stripe from 'https://esm.sh/stripe@14.23.0?target=deno&no-check'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Gestion du CORS (pour que le navigateur accepte la réponse)
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const body = await req.json()
    console.log("Requête reçue :", body)

    // --- CAS 1 : VÉRIFICATION APRÈS PAIEMENT (Page Success) ---
    if (body.sessionId) {
      const session = await stripe.checkout.sessions.retrieve(body.sessionId)
      
      return new Response(JSON.stringify({ 
        success: true,           // ✅ C'est sûrement cette ligne qui manquait !
        status: session.status, 
        payment_status: session.payment_status 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }
    
    // --- CAS 2 : CRÉATION DU PAIEMENT (Bouton Payer) ---
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: body.items,
      mode: 'payment',
      success_url: body.success_url,
      cancel_url: body.cancel_url,
      customer_email: body.customer_email,
      // ⬇️ ON AJOUTE ÇA POUR NE PLUS RIEN PERDRE ⬇️
      metadata: {
        customer_name: body.customer_name || "Non renseigné",
        address: body.address || "Non renseignée",
        phone: body.phone || "Non renseigné",
        details: body.extra_info || "" // Si tu as d'autres champs
      },
      // Optionnel : Force Stripe à demander l'adresse de livraison lui-même
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH'], 
      },
    })

    return new Response(JSON.stringify({ 
      success: true, 
      id: session.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Erreur détectée :", error.message)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})