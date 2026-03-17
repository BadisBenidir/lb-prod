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

    // --- 🟢 NOUVEAU : MODE VÉRIFICATION (Page Succès) ---
    // Si la requête contient un session_id, on traite uniquement le succès
    if (body.session_id) {
      const session = await stripe.checkout.sessions.retrieve(body.session_id)
      
      if (session.payment_status === 'paid') {
        const orderId = session.metadata?.order_id
        
        // On met à jour la commande dans ta base
        const { error: updateError } = await supabase
          .from('orders')
          .update({ payment_status: 'paid', status: 'processing' })
          .eq('id', orderId)

        if (updateError) throw updateError

        return new Response(JSON.stringify({ success: true }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        })
      }
      throw new Error("Paiement non confirmé par Stripe")
    }

    // --- 🔵 MODE CRÉATION (Ton code actuel, déplacé ici) ---
    const customerEmail = body.customer_email || body.email || (body.customerDetails && body.customerDetails.email);
    
    // On ne vérifie l'email QUE si on n'est pas en mode succès
    if (!customerEmail) {
      throw new Error("L'email du client est manquant dans la requête.");
    }

    const details = body.customerDetails || body;
    const orderNumber = `OZ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const subtotal = body.items.reduce((acc: number, item: any) => acc + (item.price_data.unit_amount * item.quantity), 0) / 100;
    const shippingCost = (body.shipping_cost || 0) / 100;
    const totalAmount = subtotal + shippingCost;

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
          first_name: details.firstName || details.customer_name?.split(' ')[0] || "",
          last_name: details.lastName || details.customer_name?.split(' ')[1] || "",
          address: details.address || details.line1,
          city: details.city,
          postcode: details.zip_code || details.zipCode,
          phone: details.phone
        }
      }])
      .select()
      .single()

    if (dbError) throw new Error(`Erreur Commande: ${dbError.message}`);

    const orderItems = body.items.map((item: any) => ({
      order_id: order.id,
      quantity: item.quantity,
      unit_price: item.price_data.unit_amount / 100,
      line_total: (item.price_data.unit_amount * item.quantity) / 100,
      product_snapshot: {
        name: item.price_data.product_data.name,
        image: item.price_data.product_data.images?.[0] || null
      }
    }));

    await supabase.from('order_items').insert(orderItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        ...body.items,
        {
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(shippingCost * 100),
            product_data: { 
              name: `Frais de livraison (${body.delivery_method === 'point_relais' ? 'Point Relais' : 'À domicile'})`,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: body.success_url,
      cancel_url: body.cancel_url,
      customer_email: customerEmail,
      metadata: { order_id: order.id }
    })

    return new Response(JSON.stringify({ id: session.id }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })

  } catch (error) {
    console.error("Erreur détectée:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 400 
    })
  }
})