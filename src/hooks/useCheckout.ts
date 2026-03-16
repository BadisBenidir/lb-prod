import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const useCheckout = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processStripeCheckout = async (
    cartItems: any[],
    shippingAddress: any,
    shippingMethod: string,
    userId: string,
    userEmail: string,
    subtotal: number,
    shippingCost: number,
    totalAmount: number
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      console.log("🚀 Lancement de l'appel Supabase...");

      const { data, error: funcError } = await supabase.functions.invoke('bright-processor', {
        body: {
          cartItems,
          shippingAddress,
          customerEmail: userEmail, 
          customer_name: `${shippingAddress?.firstName || ''} ${shippingAddress?.lastName || ''}`,
          delivery_method: shippingMethod,
          userId,
          subtotal: Number(subtotal),
          shipping: Number(shippingCost),
          total: Number(totalAmount)
        },
      });

      if (funcError) {
        // ✅ On essaye de lire le message d'erreur caché dans la réponse
        const errorDetail = await funcError.context?.json();
        throw new Error(errorDetail?.error || funcError.message);
      }
      
      if (data?.id) {
        console.log("✅ Session Stripe créée, redirection...");
        window.location.href = `https://checkout.stripe.com/pay/${data.id}`;
      } else {
        throw new Error("Réponse de session Stripe vide.");
      }
      
      return { success: true };
    } catch (err: any) {
      console.error("❌ ERREUR :", err.message);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsProcessing(false);
    }
  };

  return { processStripeCheckout, isProcessing, error };
};