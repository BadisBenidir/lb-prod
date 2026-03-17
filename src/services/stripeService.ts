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
  discountAmount?: number;
  couponCode?: string;
  couponId?: string;
}

export const createCheckoutSession = async (data: CheckoutSessionData) => {
  try {
    // 1. Calcul des réductions
    const discountAmount = data.discountAmount || 0;
    const hasDiscount = discountAmount > 0;

    const itemsWithDiscount = data.cartItems.map(item => {
      let adjustedPrice = item.price;
      if (hasDiscount && data.subtotal > 0) {
        const itemTotal = item.price * item.quantity;
        const discountRatio = itemTotal / data.subtotal;
        const itemDiscount = discountAmount * discountRatio;
        adjustedPrice = item.price - (itemDiscount / item.quantity);
        adjustedPrice = Math.max(adjustedPrice, 0);
      }
      return { ...item, adjustedPrice };
    });

    // 2. Préparation des infos client (On combine les champs)
    const fullName = `${data.shippingAddress.firstName} ${data.shippingAddress.lastName}`;
    const fullAddress = `${data.shippingAddress.address}, ${data.shippingAddress.postalCode} ${data.shippingAddress.city}, ${data.shippingAddress.country}`;

    // 3. Appel unique vers la fonction Supabase Edge
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bright-processor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        // Infos pour Stripe
        items: itemsWithDiscount.map(item => ({
          id: item.id,
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.name,
              description: `${item.brand} - ${item.category}`,
              images: [item.image],
              metadata: { productId: item.id }
            },
            unit_amount: Math.round(item.adjustedPrice * 100),
          },
          quantity: item.quantity,
        })),
        
        // Infos Client (Pour ton Admin et les métadonnées Stripe)
        customer_name: fullName,
        address: fullAddress,
        phone: data.shippingAddress.phone,
        customer_email: data.customerEmail,
        
        // Configuration additionnelle
        shipping_cost: Math.round(data.shipping * 100),
        success_url: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/checkout/cancel`,
        
        // Métadonnées complètes pour la traçabilité
        metadata: {
          userId: data.userId || '',
          shippingFirstName: data.shippingAddress.firstName,
          shippingLastName: data.shippingAddress.lastName,
          shippingPhone: data.shippingAddress.phone,
          subtotal: data.subtotal.toString(),
          total: data.total.toString(),
          couponCode: data.couponCode || '',
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la création de la session');
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
    if (!stripe) throw new Error('Stripe non disponible');
    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) throw new Error(error.message);
    return { success: true };
  } catch (error: any) {
    console.error('Erreur redirection:', error);
    return { success: false, error: error.message };
  }
};

export const getStripe = () => stripePromise;