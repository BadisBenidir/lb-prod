import { loadStripe } from '@stripe/stripe-js';
import { CartItem, ShippingAddress } from '../types';

// Initialiser Stripe avec la clé publique
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export interface CheckoutSessionData {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  customerEmail: string;
  userId?: string;
  subtotal: number;
  shipping: number;
  total: number;
  // Infos coupon
  discountAmount?: number;
  couponCode?: string;
  couponId?: string;
}

export const createCheckoutSession = async (data: CheckoutSessionData) => {
  try {
    // Calculer les prix avec réduction si coupon appliqué
    const discountAmount = data.discountAmount || 0;
    const hasDiscount = discountAmount > 0;

    // Appliquer la réduction proportionnellement aux produits
    const itemsWithDiscount = data.cartItems.map(item => {
      let adjustedPrice = item.price;

      if (hasDiscount && data.subtotal > 0) {
        // Calculer la part de réduction pour cet article
        const itemTotal = item.price * item.quantity;
        const discountRatio = itemTotal / data.subtotal;
        const itemDiscount = discountAmount * discountRatio;
        // Prix ajusté par unité
        adjustedPrice = item.price - (itemDiscount / item.quantity);
        // S'assurer que le prix ne devient pas négatif
        adjustedPrice = Math.max(adjustedPrice, 0);
      }

      return {
        ...item,
        adjustedPrice
      };
    });

    // Appel vers la fonction Supabase Edge
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bright-processor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        items: itemsWithDiscount.map(item => ({
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.name,
              description: `${item.brand} - ${item.category}`,
              images: [item.image],
              metadata: {
                productId: item.id,
                brand: item.brand,
                category: item.category
              }
            },
            unit_amount: Math.round(item.adjustedPrice * 100), // Stripe utilise les centimes (prix avec réduction)
          },
          quantity: item.quantity,
        })),

        success_url: `${window.location.origin}/success`,
        cancel_url: `${window.location.origin}/cart`,
        customer_email: data.customerEmail,

        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: Math.round(data.shipping * 100),
                currency: 'eur',
              },
              display_name: 'Livraison Chronopost',
              delivery_estimate: {
                minimum: {
                  unit: 'business_day',
                  value: 1,
                },
                maximum: {
                  unit: 'business_day',
                  value: 2,
                },
              },
            },
          },
        ],
        customer_email: data.customerEmail,
        billing_address_collection: 'auto',
        metadata: {
          userId: data.userId || '',
          shippingFirstName: data.shippingAddress.firstName,
          shippingLastName: data.shippingAddress.lastName,
          shippingPhone: data.shippingAddress.phone,
          shippingAddress: data.shippingAddress.address,
          shippingCity: data.shippingAddress.city,
          shippingPostalCode: data.shippingAddress.postalCode,
          shippingCountry: data.shippingAddress.country,
          subtotal: data.subtotal.toString(),
          shipping: data.shipping.toString(),
          total: data.total.toString(),
          // Informations coupon pour traçabilité
          discountAmount: (data.discountAmount || 0).toString(),
          couponCode: data.couponCode || '',
          couponId: data.couponId || '',
        },
        success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/checkout/cancel`,
        mode: 'payment',
      }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création de la session de paiement');
    }

    const session = await response.json();
    return { success: true, sessionId: session.id };

  } catch (error) {
    console.error('Erreur Stripe:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur de paiement' 
    };
  }
};

export const redirectToCheckout = async (sessionId: string) => {
  try {
    const stripe = await stripePromise;
    
    if (!stripe) {
      throw new Error('Stripe non disponible');
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: sessionId,
    });

    if (error) {
      console.error('Erreur redirection Stripe:', error);
      return { success: false, error: error.message };
    }

    return { success: true };

  } catch (error) {
    console.error('Erreur redirection:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur de redirection' 
    };
  }
};

export const getStripe = () => stripePromise;