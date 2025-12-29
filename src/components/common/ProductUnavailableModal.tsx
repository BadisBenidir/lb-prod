import React from 'react';
import { X, AlertTriangle, ShoppingCart } from 'lucide-react';
import { ProductAvailabilityResult } from '../../services/productAvailabilityService';

interface ProductUnavailableModalProps {
  isOpen: boolean;
  onClose: () => void;
  availabilityResult: ProductAvailabilityResult;
  onContinueWithAvailable: () => void;
  onReturnToShopping: () => void;
}

const ProductUnavailableModal: React.FC<ProductUnavailableModalProps> = ({
  isOpen,
  onClose,
  availabilityResult,
  onContinueWithAvailable,
  onReturnToShopping
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Produits non disponibles
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Certains produits de votre panier ne sont plus disponibles :
          </p>

          {/* Produits indisponibles */}
          <div className="space-y-3 mb-6">
            {availabilityResult.unavailableProducts.map((product, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="font-medium text-red-900">{product.name}</div>
                <div className="text-sm text-red-700">{product.reason}</div>
              </div>
            ))}
          </div>

          {/* Produits encore disponibles */}
          {availabilityResult.availableProducts.length > 0 && (
            <div className="mb-6">
              <p className="text-green-700 font-medium mb-2">
                ✅ Produits encore disponibles ({availabilityResult.availableProducts.length}) :
              </p>
              <div className="space-y-2">
                {availabilityResult.availableProducts.map((product, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-2">
                    <div className="text-sm text-green-900">{product.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {availabilityResult.availableProducts.length > 0 ? (
              <>
                <button
                  onClick={onContinueWithAvailable}
                  className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Continuer avec les produits disponibles
                </button>
                <button
                  onClick={onReturnToShopping}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Retourner à la boutique
                </button>
              </>
            ) : (
              <button
                onClick={onReturnToShopping}
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Retourner à la boutique
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl">
          <p className="text-xs text-gray-600 text-center">
            Nos produits vintage sont uniques. Premier arrivé, premier servi ! 🏃‍♀️
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductUnavailableModal;