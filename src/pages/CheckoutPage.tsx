import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { CartItem, ShippingAddress, PaymentMethod } from '../types';
import { createCheckoutSession, redirectToCheckout, CheckoutSessionData } from '../services/stripeService';
import { checkCartProductsAvailability, ProductAvailabilityResult } from '../services/productAvailabilityService';

export const useCheckout = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availabilityResult, setAvailabilityResult] = useState<ProductAvailabilityResult | null>(null);

  const createOrder = async (
    cartItems: CartItem[],
    shippingAddress: ShippingAddress,
    billingAddress: ShippingAddress,
    paymentMethod: PaymentMethod,
    shippingMethod: string, // "Point Relais" ou "Domicile"
    amounts: { subtotal: number; shippingCost: number; totalAmount: number; },
    userId: string
  ) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // 1. Créer la commande dans la table 'orders'
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: userId,
          subtotal: amounts.subtotal,
          shipping_cost: amounts.shippingCost,
          total_amount: amounts.totalAmount,
          // On enregistre le mode de livraison !
          shipping_method: shippingMethod, 
          status: 'pending',
          payment_status: 'pending',
          // Bloc adresse complet pour l'Admin
          shipping_address: {
            full_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
            address: shippingAddress.address,
            city: shippingAddress.city,
            postcode: shippingAddress.postalCode,
            phone: shippingAddress.phone,
            email: shippingAddress.email
          }
        })
        .select()
        .single();

      if (orderError) throw new Error(orderError.message);

      // 2. Créer les lignes de commande (Table order_items)
      // On utilise les noms de colonnes exacts de ton Image 133601
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity, // Correction du nom de la colonne
        product_snapshot: {
          name: item.name,
          image: item.image,
          brand: item.brand
        }
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw new Error(itemsError.message);

      // 3. Vider le panier
      await supabase.from('cart_items').delete().eq('user_id', userId);

      return { success: true, orderId: order.id };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la commande';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsProcessing(false);
    }
  };

  const processStripeCheckout = async (
    cartItems: CartItem[],
    shippingAddress: ShippingAddress,
    shippingMethod: string,
    userId?: string,
    subtotal: number = 0,
    shipping: number = 0,
    total: number = 0,
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      const availability = await checkCartProductsAvailability(cartItems);
      if (!availability.allAvailable) throw new Error(`Produits non disponibles`);

      const checkoutData: any = {
        cartItems,
        shippingAddress,
        customerEmail: shippingAddress.email,
        customer_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        delivery_method: shippingMethod,
        userId,
        subtotal,
        shipping,
        total
      };

      const sessionResult = await createCheckoutSession(checkoutData);
      if (!sessionResult.success || !sessionResult.sessionId) throw new Error(sessionResult.error);

      await redirectToCheckout(sessionResult.sessionId);
      return { success: true };

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
    processStripeCheckout,
    isProcessing,
    error,
    availabilityResult
  };
};