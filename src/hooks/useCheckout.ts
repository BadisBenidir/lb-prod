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
      // 1. Créer la commande
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

      // 2. Créer les lignes de commande
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

      // 3. Vider le panier
      const { error: cartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (cartError) throw new Error(cartError.message);

      // 4. Mettre à jour le statut des produits (passer de 'for-sale-online' à 'sold-online')
      const productIds = cartItems.map(item => item.id);
      const { error: productsError } = await supabase
        .from('products')
        .update({ status: 'sold-online' })
        .in('id', productIds);

      if (productsError) throw new Error(productsError.message);

      return { success: true, orderId: order.id };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue lors de la validation de la commande';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateShippingCost = (address: ShippingAddress, items: CartItem[]): number => {
    // Logique de calcul des frais de livraison
    // Pour l'instant, retourne un montant fixe
    return 5.99;
  };

  const processStripeCheckout = async (
    cartItems: CartItem[],
    shippingAddress: ShippingAddress,
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
    setAvailabilityResult(null);

    try {
      console.log('🚀 Démarrage du processus Stripe Checkout...');

      // 🛡️ NIVEAU 1 : Vérification pré-Stripe
      console.log('🔍 Vérification disponibilité des produits...');
      const availability = await checkCartProductsAvailability(cartItems);
      setAvailabilityResult(availability);

      if (!availability.allAvailable) {
        const unavailableNames = availability.unavailableProducts.map(p => `${p.name} (${p.reason})`).join(', ');
        throw new Error(`Produits plus disponibles: ${unavailableNames}`);
      }

      console.log('✅ Tous les produits sont disponibles');

      // Préparer les données pour Stripe
      const checkoutData: CheckoutSessionData = {
        cartItems,
        shippingAddress,
        customerEmail: shippingAddress.email,
        userId,
        subtotal,
        shipping,
        total,
        // Données coupon si présentes
        discountAmount: couponData?.discountAmount,
        couponCode: couponData?.couponCode,
        couponId: couponData?.couponId
      };

      console.log('📦 Données checkout:', checkoutData);

      // Créer la session Stripe
      const sessionResult = await createCheckoutSession(checkoutData);
      
      if (!sessionResult.success || !sessionResult.sessionId) {
        throw new Error(sessionResult.error || 'Erreur lors de la création de la session');
      }

      console.log('✅ Session Stripe créée:', sessionResult.sessionId);

      // Rediriger vers Stripe Checkout
      const redirectResult = await redirectToCheckout(sessionResult.sessionId);
      
      if (!redirectResult.success) {
        throw new Error(redirectResult.error || 'Erreur de redirection');
      }

      return { success: true, sessionId: sessionResult.sessionId };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du paiement';
      console.error('❌ Erreur Stripe checkout:', err);
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