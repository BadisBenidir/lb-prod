import { useState } from 'react';
import { supabase } from '../lib/supabase'; 
import { CartItem } from '../types';

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
      // ✅ Appel officiel de la fonction Supabase avec authentification automatique
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

      if (funcError) throw new Error(funcError.message);
      
      // ✅ Redirection vers Stripe
      if (data?.id) {
        window.location.href = `https://checkout.stripe.com/pay/${data.id}`;
      } else {
        throw new Error("La session de paiement n'a pas pu être créée.");
      }
      
      return { success: true };
    } catch (err: any) {
      console.error("Erreur détectée :", err.message);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsProcessing(false);
    }
  };

  return { processStripeCheckout, isProcessing, error };
};