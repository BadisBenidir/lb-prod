import { useState } from 'react';

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
      // ✅ On utilise "supabase.functions.invoke" au lieu de "fetch"
      // Ça ajoute automatiquement les clés de sécurité (Headers)
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
      
      if (data?.id) {
        window.location.href = `https://checkout.stripe.com/pay/${data.id}`;
      }
      return { success: true };
    } catch (err: any) {
      console.error("Erreur Checkout:", err.message);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsProcessing(false);
    }
  };

  return { processStripeCheckout, isProcessing, error };
};