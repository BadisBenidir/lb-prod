import React from 'react';
import { ArrowRight, Star, Heart, ShoppingBag } from 'lucide-react';

interface BoutiqueHighlightDesktopProps {
  onNavigateToBoutique?: () => void;
  featuredProducts?: Array<{
    id: string;
    name: string;
    price: number;
    images?: string[];
    image?: string;
    brand?: string;
    brand_name?: string;
  }>;
}

const BoutiqueHighlightDesktop: React.FC<BoutiqueHighlightDesktopProps> = ({ 
  onNavigateToBoutique,
  featuredProducts = []
}) => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="flex items-center mb-6">
              <Star className="h-6 w-6 text-gray-800 mr-3" />
              <span className="text-gray-800 text-sm font-medium tracking-wider uppercase">
                Notre Collection Exclusive
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-6">
              Des pièces d'exception
              <span className="block font-bold text-black">soigneusement sélectionnées</span>
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Chaque article de notre boutique a été sélectionné avec exigence.
              Maroquinerie et prêt-à-porter de luxe de seconde main,
              authentifiés et classifiés selon nos standards de qualité.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <Heart className="h-5 w-5 text-gray-800 mr-3" />
                <span className="text-gray-700">État neuf, excellent, et très bon uniquement</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 text-black mr-3" />
                <span className="text-gray-700">Authenticité vérifiée par une expertise rigoureuse</span>
              </div>
              <div className="flex items-center">
                <ShoppingBag className="h-5 w-5 text-gray-900 mr-3" />
                <span className="text-gray-700">Collection renouvelé régulièrement</span>
              </div>
            </div>
            
            <button
              onClick={onNavigateToBoutique}
              className="bg-black text-white px-8 py-4 font-medium hover:bg-gray-800 transition-colors flex items-center text-base group"
            >
              EXPLORER LA BOUTIQUE
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          {/* Featured Products Preview */}
          <div className="relative">
            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {featuredProducts.slice(0, 4).map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white/80 backdrop-blur-sm rounded-lg p-4 hover:bg-white transition-colors duration-300 cursor-pointer border border-gray-200 shadow-sm"
                    onClick={onNavigateToBoutique}
                  >
                    <div className="aspect-square bg-gray-200 rounded-md mb-3 overflow-hidden">
                      <img
                        src={product.images && product.images[0] ? product.images[0] : product.image || 'https://via.placeholder.com/200x200?text=No+Image'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1 truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">{product.brand || product.brand_name || 'Marque'}</p>
                    <p className="text-sm font-semibold text-black">
                      €{product.price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              // Placeholder if no products
              <div className="bg-gray-100 backdrop-blur-sm rounded-2xl p-12 text-center border border-gray-200">
                <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-700 text-lg">
                  Collection en cours de mise à jour
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  De nouvelles pièces d'exception arrivent bientôt
                </p>
              </div>
            )}
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-gray-300/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-black/5 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoutiqueHighlightDesktop;