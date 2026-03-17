import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno&no-check'
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
    
    // --- 🟢 BLOC SUCCÈS (Mise à jour commande + articles vendus) ---
    if (body.session_id || body.sessionId) {
      const session = await stripe.checkout.sessions.retrieve(body.session_id || body.sessionId);
      
      if (session.payment_status === 'paid') {
        // ✅ 1. ON DÉFINIT L'ID DE LA COMMANDE (C'est ce qui manquait !)
        const orderId = session.metadata?.order_id;

        // 2. On valide la commande
        await supabase.from('orders')
          .update({ payment_status: 'paid', status: 'processing' })
          .eq('id', orderId);

        // 3. On récupère les IDs des produits de cette commande
        const { data: items } = await supabase
          .from('order_items')
          .select('product_id')
          .eq('order_id', orderId);

        if (items && items.length > 0) {
          const productIds = items.map(i => i.product_id).filter(id => id);
          
          // 4. On les passe en "vendu" dans la table products
          await supabase
            .from('products')
            .update({ status: 'vendu' })
            .in('id', productIds);
        }

        return new Response(JSON.stringify({ success: true }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }
      return new Response(JSON.stringify({ error: "Paiement échoué" }), { status: 400, headers: corsHeaders });
    }

    // --- BLOC CRÉATION (Remets l'email ici) ---
    const customerEmail = body.customer_email || body.email || (body.customerDetails?.email);
    if (!customerEmail) throw new Error("L'email est requis pour créer une commande.");

    const details = body.customerDetails || body;
    const orderNumber = `OZ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // CALCULS
    const subtotal = body.items.reduce((acc: number, item: any) => acc + (item.price_data.unit_amount * item.quantity), 0) / 100;
    const shippingCost = (body.shipping_cost || 0) / 100;
    const totalAmount = subtotal + shippingCost;

    // 1. CRÉATION DE LA COMMANDE
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert([{
        order_number: orderNumber,
        email: customerEmail, // ✅ Corrigé !
        subtotal: subtotal,
        shipping_cost: shippingCost,
        total_amount: totalAmount,
        currency: 'EUR',
        status: 'pending',
        payment_status: 'pending',
        shipping_address: {
          // On met TOUT ici pour que l'Admin (Image 133334) trouve le nom
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

    // 2. ENREGISTREMENT DES ARTICLES (Pour la zone "Articles commandés")
    const orderItems = body.items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id || item.product_id,
      quantity: item.quantity,
      unit_price: item.price_data.unit_amount / 100,
      line_total: (item.price_data.unit_amount * item.quantity) / 100,
      product_snapshot: {
        name: item.price_data.product_data.name,
        image: item.price_data.product_data.images?.[0] || null
      }
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      console.error("Erreur insertion order_items:", itemsError.message);
      throw new Error(`Erreur technique (items): ${itemsError.message}`);
    }

    // 3. SESSION STRIPE
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        ...body.items, // On garde tes articles
        {
          // ✅ ON AJOUTE LES FRAIS DE PORT ICI
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(shippingCost * 100), // shippingCost est déjà défini en Euros plus haut dans ton code
            product_data: { 
              name: `Frais de livraison (${body.delivery_method === 'domicile' ? 'À domicile' : 'Point Relais'})`,
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

    await supabase.from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id);

    return new Response(JSON.stringify({ id: session.id }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error("Erreur détectée:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 400 })
  }
});