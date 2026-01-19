import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import { useProduct } from '../../hooks/useProduct';
import { useCartContext } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import FavoriteButton from '../common/FavoriteButton';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userId, isAuthenticated } = useAuth();
  const { addToCart } = useCartContext();
  const { product, loading, error } = useProduct(id || null);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedDefectImageIndex, setSelectedDefectImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleBack = () => {
    navigate('/boutique');
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Chargement du produit...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error || 'Produit non trouvé'}</p>
        <button
          onClick={handleBack}
          className="bg-black text-white px-6 py-2 font-medium hover:bg-gray-800 transition-colors"
        >
          Retour à la boutique
        </button>
      </div>
    );
  }

  // Utiliser les images multiples ou fallback sur l'image principale
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const defectImages = product.defectImages || [];
  const hasDefectImages = defectImages.length > 0;

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextDefectImage = () => {
    setSelectedDefectImageIndex((prev) => (prev + 1) % defectImages.length);
  };

  const previousDefectImage = () => {
    setSelectedDefectImageIndex((prev) => (prev - 1 + defectImages.length) % defectImages.length);
  };

  const translateCondition = (condition: string) => {
    const translations: Record<string, string> = {
      'new': 'Neuf',
      'neuf': 'Neuf',
      'excellent': 'Excellent',
      'very good': 'Très Bon',
      'good': 'Bon',
      'fair': 'Correct',
    };
    return translations[condition] || condition;
  };

  const translateGenre = (genre?: string) => {
    if (!genre) return '';
    const translations: Record<string, string> = {
      'femme': 'Femme',
      'homme': 'Homme',
      'fille': 'Fille',
      'garcon': 'Garçon'
    };
    return translations[genre] || genre;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Retour</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-6">
            {/* Carrousel photos produit */}
            <div className="space-y-4">
              {/* Image principale */}
              <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Badge VENDU pour les produits sold-display */}
                {product.isSoldDisplay && (
                  <div className="absolute inset-0 bg-black-40 flex items-center justify-center">
                    <span className="bg-white text-black font-bold text-xl px-8 py-3 tracking-widest shadow-lg">
                      VENDU
                    </span>
                  </div>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={previousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                {/* Indicateur d'images */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Miniatures produit */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 aspect-square w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === selectedImageIndex ? 'border-black' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Informations produit */}
          <div className="space-y-6">
            {/* En-tête produit */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{product.brand}</span>
                {product.genre && (
                  <>
                    <span>•</span>
                    <span>{translateGenre(product.genre)}</span>
                  </>
                )}
                {product.productCode && (
                  <>
                    <span>•</span>
                    <span>{product.productCode}</span>
                  </>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {product.name}
              </h1>
            </div>

            {/* Prix et état */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {product.price.toLocaleString('fr-FR')} €
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-gray-500 line-through">
                    {product.originalPrice.toLocaleString('fr-FR')} €
                  </span>
                )}
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.condition === 'New' ? 'bg-purple-100 text-purple-800' :
                product.condition === 'Excellent' ? 'bg-blue-100 text-blue-800' :
                product.condition === 'Very Good' ? 'bg-green-100 text-geen-800' :
                product.condition === 'Good' ? 'bg-yellow-100 text-yellow-800' :
                product.condition === 'Fair' ? 'bg-orange-100 text-orange-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {translateCondition(product.condition)}
              </span>
            </div>


            {/* Description */}
            {product.description && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Détails produit */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Détails</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Marque</span>
                    <span className="font-medium">{product.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Catégorie</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">État</span>
                    <span className="font-medium">{translateCondition(product.condition)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">N° de série</span>
                    <span className="font-medium">
                      {product.serialNumber ? (
                        <span className="font-mono text-xs">{product.serialNumber}</span>
                      ) : (
                        <em className="text-gray-400 font-normal">Non communiqué</em>
                      )}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {product.genre && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Genre</span>
                      <span className="font-medium">{translateGenre(product.genre)}</span>
                    </div>
                  )}
                  {product.material && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Matière</span>
                      <span className="font-medium capitalize">{product.material}</span>
                    </div>
                  )}
                  {product.colors && product.colors.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Couleurs</span>
                      <span className="font-medium capitalize">
                        {product.colors.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Défauts texte (si présent) */}
            {product.defects && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-orange-800">Points d'attention</h3>
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                  <p className="text-orange-800 text-sm leading-relaxed">
                    {product.defects}
                  </p>
                </div>
              </div>
            )}

            {/* Photos des defauts accordéon */}
            {defectImages?.length > 0 && (
              <details className='mb-4 rounded-xl border border-gray-200 bg-white'>
                <summary className='list-none cursor-pointer w-full'>
                  <div className='w-full flex items-center gap-3 px-5 py-3 rounded-xl bg-white shadow-md border border-gray-200 text-gray-900 text-lg font-medium hover:shadow-lg hover:bg-gray-50 transition w-fit'>
                  <span className='chevron text-2xl transition-transform duration-300'>➤</span>
                  <span>Photos des défauts</span>
                  </div>
                </summary>
                <div className='mt-3 relative z-0'>

                  {/* Carrousel photos défauts (si présentes) */}
                  {hasDefectImages && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-orange-800"></h3>
                      {/* Image principale défaut */}
                      <div className="relative aspect-square bg-orange-50 rounded-lg overflow-hidden border-2 border-orange-200">
                        <img
                          src={defectImages[selectedDefectImageIndex]}
                          alt={`Défaut ${selectedDefectImageIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {defectImages.length > 1 && (
                          <>
                            <button
                              onClick={previousDefectImage}
                              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                            >
                              <ChevronLeft className="h-5 w-5 text-orange-800" />
                            </button>
                            <button
                              onClick={nextDefectImage}
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                            >
                            <ChevronRight className="h-5 w-5 text-orange-800" />
                            </button>
                          </>
                        )}
                        {/* Indicateur d'images défauts */}
                        {defectImages.length > 1 && (
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {defectImages.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setSelectedDefectImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  index === selectedDefectImageIndex ? 'bg-orange-600' : 'bg-orange-300'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Miniatures défauts */}
                      {defectImages.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {defectImages.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedDefectImageIndex(index)}
                              className={`flex-shrink-0 aspect-square w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                                index === selectedDefectImageIndex ? 'border-orange-600' : 'border-orange-200'
                              }`}
                            >
                              <img
                                src={image}
                                alt={`Défaut ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </details>
            )}



            {/* Actions */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 mt-8">
              {/* Message pour produit vendu affiché */}
              {product.isSoldDisplay && (
                <div className="mb-4 bg-gray-100 border border-gray-300 p-3 rounded-lg text-center">
                  <p className="text-gray-700 font-medium">Ce produit a été vendu</p>
                  <p className="text-gray-500 text-sm">Découvrez nos autres pièces disponibles</p>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || product.isSoldDisplay}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 font-medium transition-colors ${
                    product.inStock && !product.isSoldDisplay
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {product.isSoldDisplay ? 'Vendu' : product.inStock ? 'Ajouter au panier' : 'Épuisé'}
                </button>
                {isAuthenticated && userId && (
                  <FavoriteButton 
                    productId={product?.id || ''} 
                    userId={userId} 
                    size="lg"
                    className="border border-gray-300 hover:border-gray-400 rounded-lg px-4 py-3"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;