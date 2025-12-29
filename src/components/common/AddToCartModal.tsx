import React from 'react';
import { X, Check } from 'lucide-react';
import { Product } from '../../types';
import Portal from './Portal';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onViewCart?: () => void;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({
  isOpen,
  onClose,
  product,
  onViewCart
}) => {
  if (!isOpen || !product) return null;

  return (
    <Portal>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[9999]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">Produit ajouté</h3>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex gap-4">
              <img
                src={product.image || product.images?.[0] || '/placeholder-image.jpg'}
                alt={product.name}
                className="w-16 h-16 object-cover bg-gray-100 rounded flex-shrink-0"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-600">{product.brand}</p>
                <p className="font-semibold text-gray-900 mt-1">€{product.price.toLocaleString()}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mt-4">
              Le produit a été ajouté à votre panier avec succès.
            </p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Continuer les achats
            </button>
            <button
              onClick={() => {
                onClose();
                onViewCart?.();
              }}
              className="flex-1 py-2 px-4 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded transition-colors"
            >
              Voir le panier
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default AddToCartModal;
