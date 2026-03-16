import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { CartItem, ShippingAddress } from '../types';

export const useCheckout = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processStripeCheckout = async (
    cartItems: CartItem[],
    shippingAddress: ShippingAddress,
    shippingMethod: string, // ✅ Ajouté ici
    userId: string,
    subtotal: number,
    shippingCost: number
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      // ✅ On utilise "invoke" pour passer les clés de sécurité automatiquement
      const { data, error: funcError } = await supabase.functions.invoke('bright-processor', {
        body: {
          cartItems,
          shippingAddress,
          customerEmail: shippingAddress.email, 
          customer_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          delivery_method: shippingMethod, // ✅ "Point Relais" ou "Domicile"
          userId,
          subtotal,
          shipping: shippingCost
        },
      });

      if (funcError) throw new Error(funcError.message);
      
      if (data?.id) {
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