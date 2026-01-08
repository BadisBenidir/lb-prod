import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Heart, X } from 'lucide-react';
import { Product } from '../../types';

interface ProductSoldModalProps {
  isOpen: boolean;
  onClose: () => void;
  soldProducts: Product[];
}

const ProductSoldModal: React.FC<ProductSoldModalProps> = ({ isOpen, onClose, soldProducts }) => {
  // Fermer la modal en appuyant sur Échap
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSingleProduct = soldProducts.length === 1;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isSingleProduct ? 'Victime de son succès !' : 'Victimes de leur succès !'}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="text-center text-gray-600 mb-6">
            {isSingleProduct ? (
              <>
                L'article que vous aviez mis dans votre panier a été acquis par un autre client.
              </>
            ) : (
              <>
                {soldProducts.length} articles de votre panier ont été acquis par d'autres clients.
              </>
            )}
          </div>

          {/* Produits vendus */}
          <div className="space-y-3 mb-6 max-h-40 overflow-y-auto">
            {soldProducts.map((product) => (
              <div key={product.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {product.brand}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-sm font-medium text-gray-900">
                    {product.price.toLocaleString('fr-FR')} €
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Message encourageant */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Nos pièces étant uniques, nous vous invitons à découvrir d'autres merveilles dans notre collection.
            </p>
            
            <button
              onClick={onClose}
              className="w-full bg-black text-white py-3 px-4 font-medium hover:bg-gray-800 transition-colors rounded-lg"
            >
              Découvrir d'autres pièces
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProductSoldModal;