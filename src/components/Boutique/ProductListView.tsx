import React from 'react';
import { Product } from '../../types';
import FavoriteButton from '../common/FavoriteButton';
import { translateCondition } from '../../utils/translations';

interface ProductListViewProps {
  product: Product;
  onProductClick?: (productId: string) => void;
  userId?: string | null;
}

const ProductListView: React.FC<ProductListViewProps> = ({ product, onProductClick, userId }) => {
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 p-4 md:p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div 
        className="relative w-full sm:w-24 md:w-32 aspect-[4/5] sm:aspect-square md:aspect-square overflow-hidden flex-shrink-0 cursor-pointer"
        onClick={() => onProductClick?.(product.id)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain"
        />
        {product.isSoldDisplay && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="bg-white text-black rounded-md px-4 py-2 text-xs font-semibold px-3 py-1 tracking-wider">VENDU</span>
          </div>
        )}
        {!product.inStock && !product.isSoldDisplay && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-xs font-medium">ÉPUISÉ</span>
          </div>
        )}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs">
            -{discountPercentage}%
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col h-full">
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
            <div>
              <h3 className="font-semibold text-base md:text-lg line-clamp-2 min-h-[3rem]">{product.name}</h3>
              <p className="text-gray-600 text-sm md:text-base">{product.brand}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-bold text-lg md:text-xl">€{product.price.toLocaleString()}</p>
              {product.originalPrice && (
                <p className="text-sm text-gray-500 line-through">€{product.originalPrice.toLocaleString()}</p>
              )}
            </div>
          </div>
          
          <p className="text-gray-700 mb-3 text-sm md:text-base leading-relaxed">{product.description}</p>
          
          <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4">
            <span className={`px-2 py-1 text-xs font-medium rounded ${
              product.condition === 'New' ? 'bg-blue-100 text-blue-800' :
              product.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
              product.condition === 'Very Good' ? 'bg-yellow-100 text-yellow-800' :
              product.condition === 'Good' ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            }`}>
              {String(product.condition)}
            </span>
            <span className="text-xs md:text-sm text-gray-600">{product.category}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          {/* Bouton Favoris pour utilisateurs connectés */}
          {userId && (
            <div className="flex justify-center sm:justify-start">
              <FavoriteButton
                productId={product.id}
                userId={userId}
                size="md"
                showText={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListView;