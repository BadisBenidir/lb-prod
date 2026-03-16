// ... (garder les imports et corsHeaders identiques)

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
    
    // On extrait les infos plus proprement (certains sites utilisent customerDetails)
    const details = body.customerDetails || body; 
    const orderNumber = `OZ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Calcul précis des montants
    const subtotal = body.items.reduce((acc: number, item: any) => acc + (item.price_data.unit_amount * item.quantity), 0) / 100;
    const shippingCost = body.shipping_cost || 0;
    const totalAmount = subtotal + shippingCost;

    // --- SAUVEGARDE COMMANDE ---
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert([{
        order_number: orderNumber,
        email: details.email,
        // On tente de remplir le nom pour l'Admin
        first_name: details.firstName || details.customer_name?.split(' ')[0] || "",
        last_name: details.lastName || details.customer_name?.split(' ')[1] || "",
        phone: details.phone,
        subtotal: subtotal,
        shipping_cost: shippingCost,
        total_amount: totalAmount,
        status: 'pending',
        payment_status: 'pending',
        shipping_address: {
          full_name: details.customer_name || `${details.firstName} ${details.lastName}`,
          address: details.address,
          city: details.city,
          postcode: details.zip_code || details.zipCode,
          country: details.country || "France"
        }
      }])
      .select()
      .single()

    if (dbError) throw new Error(`Erreur Admin: ${dbError.message}`);

    // --- ICI ON DEVRA AJOUTER L'INSERTION DANS ORDER_ITEMS ---
    // On le fera dès que tu m'auras montré la table order_items !

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: body.items,
      mode: 'payment',
      success_url: body.success_url,
      cancel_url: body.cancel_url,
      customer_email: details.email,
      metadata: { order_id: order.id }
    })

    return new Response(JSON.stringify({ id: session.id }), { headers: corsHeaders })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { headers: corsHeaders, status: 400 })
  }
})