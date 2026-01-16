import React, { useState } from 'react';
import { Heart, ExternalLink, Trash2, X } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { FavoriteProduct } from '../../services/favoriteService';

interface FavoritesListProps {
  userId: string;
  onProductClick?: (productId: string) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ userId, onProductClick }) => {
  const { 
    favorites, 
    isLoading, 
    error, 
    removeFromFavorites, 
    clearError 
  } = useFavorites(userId);
  
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
  }>({ isOpen: false, productId: '', productName: '' });

  const handleRemove = (productId: string, productName: string) => {
    setConfirmModal({
      isOpen: true,
      productId,
      productName
    });
  };

  const confirmRemove = async () => {
    await removeFromFavorites(confirmModal.productId);
    setConfirmModal({ isOpen: false, productId: '', productName: '' });
  };

  const cancelRemove = () => {
    setConfirmModal({ isOpen: false, productId: '', productName: '' });
  };

  const handleProductClick = (productId: string) => {
    if (onProductClick) {
      onProductClick(productId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={clearError}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun favori pour le moment</h3>
        <p className="text-gray-500">Ajoutez des articles à vos favoris pour les retrouver facilement</p>
        <p className="text-sm text-gray-400 mt-2">
          Parcourez notre boutique et cliquez sur le cœur pour ajouter vos pièces préférées
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Mes Favoris</h2>
        <div className="flex items-center text-sm text-gray-500">
          <Heart className="h-4 w-4 mr-1 text-red-500" />
          <span>{favorites.length} article{favorites.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((product: FavoriteProduct) => (
          <div key={product.favorite_id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            {/* Image du produit */}
            <div className="relative h-48 bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Badge condition */}
              <div className="absolute top-2 left-2">
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  product.condition === 'New' ? 'bg-purple-100 text-purple-800' :
                  product.condition === 'Excellent' ? 'bg-blue-100 text-blue-800' :
                  product.condition === 'Very Good' ? 'bg-green-100 text-green-800' :
                  product.condition === 'Good' ? 'bg-yellow-100 text-yellow-800' :
                  product.condition === 'Fair' ? 'bg-orange-100 text-orange-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {product.condition}
                </span>
              </div>

              {/* Bouton supprimer */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(product.id, product.name);
                  }}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                  title="Retirer des favoris"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>

              {/* Badge sold out si applicable */}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">ÉPUISÉ</span>
                </div>
              )}
            </div>

            {/* Informations du produit */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.brand}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold text-gray-900">€{product.price.toLocaleString()}</p>
                  {product.originalPrice && (
                    <p className="text-sm text-gray-500 line-through">€{product.originalPrice.toLocaleString()}</p>
                  )}
                </div>
              </div>

              {/* Date d'ajout aux favoris */}
              <p className="text-xs text-gray-400 mb-3">
                Ajouté le {new Date(product.favorited_at).toLocaleDateString('fr-FR')}
              </p>

              {/* Boutons d'action */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleProductClick(product.id)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-black text-white hover:bg-gray-800 transition-colors text-sm"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Voir détails
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(product.id, product.name);
                  }}
                  className="px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                  title="Retirer des favoris"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message informatif */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">À propos de vos favoris</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Vos favoris sont sauvegardés et disponibles sur tous vos appareils</p>
          <p>• Chaque article est une pièce unique : si un favori disparaît, c'est qu'il a été acquis par un autre client</p>
        </div>
      </div>

      {/* Modal de confirmation */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Retirer des favoris</h3>
              <button
                onClick={cancelRemove}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600">
                Êtes-vous sûr de vouloir retirer <span className="font-semibold text-gray-900">"{confirmModal.productName}"</span> de vos favoris ?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Cette action est irréversible.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={cancelRemove}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmRemove}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-colors"
              >
                Retirer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesList;