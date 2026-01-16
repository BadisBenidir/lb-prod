import React from 'react';
import { Product } from '../../types';
import FavoriteButton from '../../components/common/FavoriteButton';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick?: (productId: string) => void;
  userId?: string | null;
}

const conditionLabelFR: Record<string, string> = {
  New: 'Neuf',
  Excellent: 'Excellent',
  'Very Good': 'Très Bon Etat',
  Good: 'Bon Etat',
  Fair: 'Correct',
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onProductClick, userId }) => {
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group cursor-pointer h-full flex flex-col">
      <div 
        className="relative overflow-hidden bg-white mb-3 md:mb-4 shrink-0"
        onClick={() => onProductClick?.(product.id)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 md:h-80 object-contain"
        />
        {product.isSoldDisplay && (
          <div className="absolute inset-0 bg-black bg-opacity-30">
            <div className="absolute bottom-3 left-3 z-10">
              <span className="bg-red-200 text-red-700 text-m font-semibold px-2 py-1 rounded-md uppercase tracking-wide">
                VENDU
              </span>  
            </div>
          </div>
        )}
        {!product.inStock && !product.isSoldDisplay && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-medium text-sm md:text-base">SOLD OUT</span>
          </div>
        )}
        {discountPercentage > 0 && (
          <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-black text-white px-2 py-1 text-xs md:text-sm">
            -{discountPercentage}%
          </div>
        )}
        <div className="absolute top-2 md:top-4 right-2 md:right-4">
          <span className={`px-2 py-1 text-xs font-medium ${
            product.condition === 'Excellent' ? 'bg-blue-100 text-blue-800' :
            product.condition === 'Very Good' ? 'bg-green-100 text-green-800' :
            product.condition === 'New' ? 'bg-purple-100 text-purple-800' :
            product.condition === 'Good' ? 'bg-yellow-100 text-yellow-800' :
            product.condition === 'Very Good' ? 'bg-orange-100 text-orange-800' :
            'bg-orange-100 text-orange-800'
          }`}>
            {product.condition}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col h-full min-h-[120px]">
        <div className="flex justify-between items-start flex-1">
          <div>
            <h3 className="font-medium text-gray-900 text-sm md:text-base">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.brand}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900 text-sm md:text-base">€{product.price.toLocaleString()}</p>
            {product.originalPrice && (
              <p className="text-sm text-gray-500 line-through">€{product.originalPrice.toLocaleString()}</p>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock || product.isSoldDisplay}
            className={`mt-auto flex-1 py-2 md:py-3 text-xs md:text-sm font-medium transition-colors ${
              product.inStock && !product.isSoldDisplay
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {product.isSoldDisplay ? 'VENDU' : product.inStock ? 'AJOUTER AU PANIER' : 'ÉPUISÉ'}
          </button>
          
          {/* Bouton Favoris à côté du bouton panier */}
          {userId && (
            <FavoriteButton 
              productId={product.id} 
              userId={userId} 
              size="md"
              className="border border-gray-300 hover:border-gray-400"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;