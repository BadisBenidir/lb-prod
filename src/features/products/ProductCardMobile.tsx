import React from 'react';
import { Product } from '../../types';
import FavoriteButton from '../../components/common/FavoriteButton';

interface ProductCardMobileProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick?: (productId: string) => void;
  userId?: string | null;
}

const conditionLabelFR: Record<string, string> = {
  New: 'Neuf',
  Excellent: 'Excellent',
  'Very Good': 'Très Bon État',
  Good: 'Bon État',
  Fair: 'Correct',
};

const ProductCardMobile: React.FC<ProductCardMobileProps> = ({ product, onAddToCart, onProductClick, userId }) => {
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02] overflow-hidden">
      {/* Image Container - Fixed Height */}
      <div 
        className="relative overflow-hidden bg-gray-100 aspect-square"
        onClick={() => onProductClick?.(product.id)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        
        {/* Sold Display Overlay */}
        {product.isSoldDisplay && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white text-black font-bold text-sm px-4 py-2 rounded-lg shadow-lg tracking-wider">
              VENDU
            </span>
          </div>
        )}

        {/* Stock Overlay */}
        {!product.inStock && !product.isSoldDisplay && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-black/40 px-3 py-1 rounded-lg">
              SOLD OUT
            </span>
          </div>
        )}
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-lg shadow-md">
            -{discountPercentage}%
          </div>
        )}
        
        {/* Condition Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-semibold rounded-lg shadow-md ${
              product.condition === 'New' ? 'bg-purple-100 text-purple-800' :
              product.condition === 'Excellent' ? 'bg-blue-100 text-blue-800' :
              product.condition === 'Very Good' ? 'bg-green-100 text-geen-800' :
              product.condition === 'Good' ? 'bg-yellow-100 text-yellow-800' :
              product.condition === 'Fair' ? 'bg-orange-100 text-orange-800' :
            'bg-orange-500 text-white'
          }`}>
          </span>
        </div>

        {/* Favorite Button Overlay */}
        {userId && (
          <div className="absolute bottom-3 right-3">
            <FavoriteButton 
              productId={product.id} 
              userId={userId} 
              size="sm"
              className="bg-white/90 hover:bg-white shadow-lg border-0"
            />
          </div>
        )}
      </div>
      
      {/* Content Container - Fixed Structure */}
      <div className="p-3 flex flex-col h-32"> {/* Fixed height container */}
        {/* Product Info - Fixed Height */}
        <div className="flex-1 mb-3">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-1 mb-2">
            {product.brand}
          </p>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900 text-sm">
                €{product.price.toLocaleString()}
              </p>
              {product.originalPrice && (
                <p className="text-xs text-gray-400 line-through">
                  €{product.originalPrice.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Action Button - Fixed Height */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          disabled={!product.inStock || product.isSoldDisplay}
          className={`w-full py-2 text-xs font-bold rounded-xl transition-all duration-300 shadow-sm ${
            product.inStock && !product.isSoldDisplay
              ? 'bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-gray-700 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {product.isSoldDisplay ? 'VENDU' : product.inStock ? 'AJOUTER AU PANIER' : 'ÉPUISÉ'}
        </button>
      </div>
    </div>
  );
};

export default ProductCardMobile;