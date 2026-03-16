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
  const { cartItems, clearCart, getTotalPrice } = useCartContext();
  const { createOrder, isProcessing, error } = useCheckout();
  
  const subtotal = getTotalPrice();

  const handleCheckoutComplete = async (orderData: any) => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    const amounts = {
      subtotal: orderData.subtotal,
      shippingCost: orderData.shippingCost,
      taxAmount: orderData.taxAmount,
      totalAmount: orderData.totalAmount
    };

    const result = await createOrder(
      cartItems,
      orderData.shippingAddress,
      orderData.billingAddress,
      orderData.paymentMethod,
      orderData.shippingMethod,
      amounts,
      user.id
    );

    if (result.success) {
      // Vider le panier local
      clearCart();
      // Appeler le callback pour indiquer que la commande est complète
      onOrderComplete(result.orderId);
    }

    return result;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Connexion requise</h2>
            <p className="text-gray-600 mb-6">Vous devez être connecté pour passer une commande.</p>
            <button
              onClick={() => window.location.hash = '#login'}
              className="bg-black text-white px-6 py-2 font-medium hover:bg-gray-800 transition-colors"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-700">Validation de votre commande en cours...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <p>{error}</p>
        </div>
      )}
      
      <Checkout
        cartItems={cartItems}
        subtotal={subtotal}
        onCheckoutComplete={handleCheckoutComplete}
        onBackToCart={onBackToCart}
      />
    </div>
  );
};

export default CheckoutPage;