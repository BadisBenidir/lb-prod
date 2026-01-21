import React from 'react';
import { ArrowRight, Star, Heart, ShoppingBag } from 'lucide-react';

interface BoutiqueHighlightMobileProps {
  featuredProducts?: {
    id: string;
    name: string;
    price: number;
    images?: string[];
    image?: string;
    brand?: string;
    brand_name?: string;
  }[];

  onNavigateToBoutique?: () => void;
  onProductClick?: (id: string) => void;
}

const BoutiqueHighlightMobile: React.FC<BoutiqueHighlightMobileProps> = ({ 
  onNavigateToBoutique,
  onProductClick,
  featuredProducts = []
}) => {

  return (
    <section className="py-8 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-8 right-4 w-20 h-20 bg-gray-300/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-8 left-4 w-16 h-16 bg-black/10 rounded-full blur-lg"></div>
      
      <div className="px-4 relative">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-gray-100/50 backdrop-blur-sm border border-gray-300/30 rounded-full px-4 py-2 mb-4">
            <Star className="h-4 w-4 text-gray-800 mr-2" />
            <span className="text-gray-900 text-xs font-semibold tracking-wider uppercase">
              Notre Collection Exclusive
            </span>
          </div>
          
          <h2 className="text-2xl font-light leading-tight mb-3 text-gray-900">
            Des pièces d'exception
            <span className="block font-bold text-black text-xl">soigneusement sélectionnées</span>
          </h2>
          
          <p className="text-base text-gray-600 leading-relaxed max-w-sm mx-auto">
            Chaque article de notre boutique a été sélectionné avec exigence.
            Maroquinerie et prêt-à-porter de luxe de seconde main,
            authentifiés et classifiés selon nos standards de qualité.
          </p>
        </div>

        {/* Features Cards */}
        <div className="grid grid-cols-1 gap-3 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="bg-gray-100 rounded-full p-2 mr-3">
                <Heart className="h-4 w-4 text-gray-800" />
              </div>
              <span className="text-gray-700 text-sm font-medium">État neuf, excellent, et très bon uniquement</span>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="bg-gray-200 rounded-full p-2 mr-3">
                <Star className="h-4 w-4 text-black" />
              </div>
              <span className="text-gray-700 text-sm font-medium">Authenticité vérifiée par une expertise rigoureuse</span>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center">
              <div className="bg-gray-300 rounded-full p-2 mr-3">
                <ShoppingBag className="h-4 w-4 text-gray-900" />
              </div>
              <span className="text-gray-700 text-sm font-medium">Collection renouvelée régulièrement</span>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="mb-8">
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {featuredProducts.slice(0, 3).map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02] overflow-hidden"
                  onClick={() => onProductClick?.(product.id)}
                >
                  <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                    <img
                      src={product.images && product.images[0] ? product.images[0] : product.image || 'https://via.placeholder.com/200x200?text=No+Image'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-semibold text-gray-900 mb-1 truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2 truncate">{product.brand || product.brand_name || 'Marque'}</p>
                    <p className="text-sm font-bold text-gray-900">
                      €{product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-100 to-white rounded-3xl p-8 text-center border border-gray-200 shadow-sm">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-gray-800" />
              </div>
              <p className="text-gray-600 font-medium mb-2">
                Collection en cours de mise à jour
              </p>
              <p className="text-gray-500 text-sm">
                De nouvelles pièces d'exception arrivent bientôt
              </p>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={onNavigateToBoutique}
            className="bg-gradient-to-r from-black to-gray-800 text-white px-8 py-4 rounded-2xl font-semibold hover:from-gray-800 hover:to-gray-700 transition-all duration-300 flex items-center justify-center text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] mx-auto group"
          >
            EXPLORER LA BOUTIQUE
            <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BoutiqueHighlightMobile;