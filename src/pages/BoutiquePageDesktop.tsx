import React from 'react';
import { useNavigate } from 'react-router-dom';
import Boutique from '../components/Boutique/Boutique';
import { useCartContext } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const BoutiquePageDesktop: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthInitialized } = useAuth();
  const { addToCart } = useCartContext();

  const handleProductClick = (productId: string) => {
    navigate(`/produit/${productId}`);
  };

  if (!isAuthInitialized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-gray-600 mb-4">Initialisation...</div>
        </div>
      </div>
    );
  }

  return (
    <Boutique 
      onAddToCart={addToCart}
      onProductClick={handleProductClick}
    />
  );
};

export default BoutiquePageDesktop;