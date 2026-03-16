import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { CartItem, ShippingAddress, PaymentMethod } from '../types';
import { createCheckoutSession, redirectToCheckout, CheckoutSessionData } from '../services/stripeService';
import { checkCartProductsAvailability, ProductAvailabilityResult } from '../services/productAvailabilityService';

export const useCheckout = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availabilityResult, setAvailabilityResult] = useState<ProductAvailabilityResult | null>(null);

  // --- FONCTION 1 : CRÉATION DIRECTE (Optionnelle si tu passes par Stripe) ---
  const createOrder = async (
    cartItems: CartItem[],
    shippingAddress: ShippingAddress,
    billingAddress: ShippingAddress,
    paymentMethod: PaymentMethod,
    shippingMethod: string,
    amounts: {
      subtotal: number;
      shippingCost: number;
      totalAmount: number;
    },
    userId: string
  ) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: userId,
          subtotal: amounts.subtotal,
          shipping_cost: amounts.shippingCost,
          total_amount: amounts.totalAmount,
          shipping_address_line1: shippingAddress.address,
          shipping_address_line2: shippingAddress.addressLine2,
          shipping_city: shippingAddress.city,
          shipping_postal_code: shippingAddress.postalCode,
          shipping_country: shippingAddress.country,
          shipping_phone: shippingAddress.phone,
          billing_address_line1: billingAddress.address,
          billing_address_line2: billingAddress.addressLine2,
          billing_city: billingAddress.city,
          billing_postal_code: billingAddress.postalCode,
          billing_country: billingAddress.country,
          payment_method: paymentMethod.type,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw new Error(orderError.message);

      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_code: item.productCode,
        brand_name: item.brand,
        category_name: item.category,
        unit_price: item.price,
        quantity: item.quantity,
        line_total: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw new Error(itemsError.message);

      const { error: cartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (cartError) throw new Error(cartError.message);

      const productIds = cartItems.map(item => item.id);
      await supabase
        .from('products')
        .update({ status: 'sold-online' })
        .in('id', productIds);

      return { success: true, orderId: order.id };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur commande';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateShippingCost = (address: ShippingAddress, items: CartItem[]): number => {
    return 5.99;
  };

  // --- FONCTION 2 : LE PASSAGE PAR STRIPE (C'est elle qui appelle bright-processor) ---
  const processStripeCheckout = async (
    cartItems: CartItem[],
    shippingAddress: ShippingAddress,
    shippingMethod: string, // ✅ AJOUTÉ : Le mode de livraison (Relais/Domicile)
    userId?: string,
    subtotal: number = 0,
    shipping: number = 0,
    total: number = 0,
    couponData?: {
      discountAmount: number;
      couponCode: string;
      couponId: string;
    }
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      // 1. Vérification disponibilité
      const availability = await checkCartProductsAvailability(cartItems);
      if (!availability.allAvailable) {
        throw new Error(`Produits plus disponibles`);
      }

      // 2. Préparer les données pour la fonction Edge (bright-processor)
      const checkoutData: any = { // On utilise any pour être sûr de passer nos nouveaux champs
        cartItems,
        shippingAddress,
        customerEmail: shippingAddress.email,
        customer_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`, // ✅ Pour l'Admin
        delivery_method: shippingMethod, // ✅ Pour l'Admin (Point Relais ou Domicile)
        userId,
        subtotal,
        shipping,
        total,
        discountAmount: couponData?.discountAmount,
        couponCode: couponData?.couponCode,
        couponId: couponData?.couponId
      };

      // 3. Créer la session Stripe via ton service
      const sessionResult = await createCheckoutSession(checkoutData);
      
      if (!sessionResult.success || !sessionResult.sessionId) {
        throw new Error(sessionResult.error || 'Erreur session');
      }

      // 4. Redirection vers Stripe
      const redirectResult = await redirectToCheckout(sessionResult.sessionId);
      if (!redirectResult.success) throw new Error(redirectResult.error);

      return { success: true, sessionId: sessionResult.sessionId };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur paiement';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    createOrder,
    calculateShippingCost,
    processStripeCheckout,
    isProcessing,
    error,
    availabilityResult
  };
};