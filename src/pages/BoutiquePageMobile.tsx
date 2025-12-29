import React from 'react';
import { useNavigate } from 'react-router-dom';
import BoutiqueMobile from '../components/Boutique/BoutiqueMobile';
import { useCartContext } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const BoutiquePageMobile: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthInitialized } = useAuth();
  const { addToCart } = useCartContext();

  const handleProductClick = (productId: string) => {
    navigate(`/produit/${productId}`);
  };

  if (!isAuthInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-gray-800 rounded-full animate-pulse"></div>
            </div>
            <div className="text-gray-700 font-medium">Chargement de la boutique...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BoutiqueMobile 
      onAddToCart={addToCart}
      onProductClick={handleProductClick}
    />
  );
};

export default BoutiquePageMobile;