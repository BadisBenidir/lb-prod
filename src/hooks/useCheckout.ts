import { useState } from 'react';
import { CartItem, ShippingAddress } from '../types';

export const useCheckout = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const response = await fetch('https://bmsasmqkmnlijpvoisep.supabase.co/functions/v1/bright-processor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems,
          shippingAddress,
          customerEmail: shippingAddress.email,
          customer_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          delivery_method: shippingMethod,
          userId,
          subtotal: Number(subtotal), // ✅ En euros
          shipping: Number(shipping), // ✅ En euros
          total: Number(total)
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Redirection vers Stripe
      if (data.id) {
        const stripeUrl = `https://checkout.stripe.com/pay/${data.id}`;
        window.location.href = stripeUrl;
      }
      
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsProcessing(false);
    }
  };

  return { processStripeCheckout, isProcessing, error };
};