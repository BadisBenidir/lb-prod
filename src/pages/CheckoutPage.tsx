import React from 'react';
import { Checkout } from '../features/checkout';
import { useAuth } from '../contexts/AuthContext';
import { useCartContext } from '../contexts/CartContext';
import { useCheckout } from '../hooks/useCheckout';

interface CheckoutPageProps {
  onBackToCart: () => void;
  onOrderComplete: (orderId: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBackToCart, onOrderComplete }) => {
  const { user } = useAuth();
  const { cartItems, getTotalPrice, clearCart } = useCartContext();
  const { processStripeCheckout, isProcessing, error } = useCheckout();

  const handleCheckoutComplete = async (orderData: any) => {
    if (!user) throw new Error('Utilisateur non connecté');

    // 🚀 Lancement de la procédure
    const result = await processStripeCheckout(
      cartItems,
      orderData.shippingAddress,
      orderData.shippingMethod || "Standard",
      user.id,
      orderData.subtotal,
      orderData.shippingCost,
      orderData.totalAmount
    );

    if (result.success) {
      clearCart();
    }
    return result;
  };

  if (!user) return <p>Connexion requise...</p>;

  return (
    <div className="min-h-screen bg-white">
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center">
            <div className="animate-spin h-10 w-10 border-b-2 border-black mx-auto mb-4"></div>
            <p>Redirection vers le paiement...</p>
          </div>
        </div>
      )}
      {error && <div className="bg-red-100 text-red-700 p-4">{error}</div>}
      <Checkout
        cartItems={cartItems}
        subtotal={getTotalPrice()}
        onCheckoutComplete={handleCheckoutComplete}
        onBackToCart={onBackToCart}
      />
    </div>
  );
};

export default CheckoutPage;