import { useState } from 'react';
import { CartItem } from '../types';

export const useCheckout = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processStripeCheckout = async (
    cartItems: CartItem[],
    shippingAddress: any,
    shippingMethod: string,
    userId: string,
    subtotal: number,
    shippingCost: number,
    totalAmount: number
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      // 🕵️ LOG POUR TOI : Vérifie dans ta console F12 si l'email s'affiche ici
      console.log("Données envoyées :", { email: shippingAddress?.email, shippingAddress });

      const response = await fetch('https://bmsasmqkmnlijpvoisep.supabase.co/functions/v1/bright-processor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems,
          shippingAddress,
          customerEmail: shippingAddress?.email, // ✅ On force l'email ici
          customer_name: `${shippingAddress?.firstName || ''} ${shippingAddress?.lastName || ''}`,
          delivery_method: shippingMethod,
          userId,
          subtotal,
          shipping: shippingCost,
          total: totalAmount
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      if (data.id) {
        window.location.href = `https://checkout.stripe.com/pay/${data.id}`;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return { processStripeCheckout, isProcessing, error };
};