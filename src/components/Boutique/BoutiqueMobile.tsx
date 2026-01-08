import React, { useState } from 'react';
import { Search, Filter, Grid, List, Star, Eye, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import { useBoutique } from '../../hooks/useBoutique';
import { useAuth } from '../../contexts/AuthContext';
import { ProductCard } from '../../features/products';
import ProductCardMobile from '../../features/products/ProductCardMobile';
import FilterSidebarMobile from './FilterSidebarMobile';

interface BoutiqueMobileProps {
  onAddToCart: (product: Product) => void;
  onProductClick: (productId: string) => void;
}

const BoutiqueMobile: React.FC<BoutiqueMobileProps> = ({ onAddToCart, onProductClick }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { userId } = useAuth();

  const {
    filters,
    sortBy,
    viewMode,
    currentPage,
    itemsPerPage,
    totalPages,
    totalResults,
    sortOptions,
    availableCategories,
    availableBrands,
    availableConditions,
    availableColors,
    availableMaterials,
    availableGenres,
    filteredProducts,
    updateFilter,
    setSortBy,
    setViewMode,
    setCurrentPage,
    setItemsPerPage,
    clearFilters,
    resultsCount,
    searchTerm,
    setSearchTerm,
    loading,
    error
  } = useBoutique();


  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-12 right-4 w-20 h-20 bg-gray-300/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-32 left-4 w-16 h-16 bg-black/5 rounded-full blur-xl"></div>
      
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="px-4 py-6">
          {/* Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center bg-gray-100 backdrop-blur-sm border border-gray-300/30 rounded-full px-4 py-2 mb-3">
              <Star className="h-4 w-4 text-gray-800 mr-2" />
              <span className="text-gray-900 text-xs font-semibold tracking-wider uppercase">
                Ma Collection
              </span>
            </div>
            <h1 className="text-2xl font-light text-gray-900 mb-2">
              Notre Boutique
            </h1>
            <p className="text-sm text-gray-600">
              {resultsCount} {resultsCount > 1 ? 'articles trouvés' : 'article trouvé'}
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent shadow-sm text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-3">
            {/* Sort */}
            <div className="flex-1">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm text-gray-700 shadow-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div className="flex bg-white/80 rounded-2xl p-1 border border-gray-200 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-gray-800 text-white shadow-md' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-gray-800 text-white shadow-md' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-3 rounded-2xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 relative">
        {loading ? (
          <div className="text-center py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100 max-w-sm mx-auto">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-gray-800 rounded-full animate-pulse"></div>
              </div>
              <p className="text-gray-600 font-medium">Chargement des produits...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 rounded-3xl p-8 shadow-lg border border-red-100 max-w-sm mx-auto">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-red-600 font-medium mb-4">Erreur: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-red-500 transition-all duration-300"
              >
                Réessayer
              </button>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-3xl p-8 shadow-lg border border-gray-100 max-w-sm mx-auto">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Eye className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium mb-4">Aucun produit ne correspond à vos critères</p>
              <button
                onClick={clearFilters}
                className="bg-gray-800 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-gray-700 transition-all duration-300"
              >
                Effacer les filtres
              </button>
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCardMobile
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onProductClick={() => onProductClick(product.id)}
                    userId={userId}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.01]"
                    onClick={() => onProductClick(product.id)}
                  >
                    <div className="flex">
                      <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden mr-4 flex-shrink-0">
                        <img
                          src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/200x200?text=No+Image'}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                          {product.brand || 'Marque'}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-gray-900">
                            €{product.price?.toLocaleString()}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart(product);
                            }}
                            className="bg-gray-800 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-gray-700 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Mobile */}
            {totalPages > 1 && (
              <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 shadow-sm">
                <div className="flex flex-col gap-4">
                  {/* Info résultats */}
                  <p className="text-sm text-gray-600 text-center">
                    {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalResults)} sur {totalResults}
                  </p>

                  {/* Contrôles pagination */}
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-800 text-white hover:bg-gray-700 shadow-md'
                      }`}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Préc.
                    </button>

                    <span className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-700">
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-800 text-white hover:bg-gray-700 shadow-md'
                      }`}
                    >
                      Suiv.
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>

                  {/* Sélecteur items par page */}
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-gray-600">Par page:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                    >
                      <option value={6}>6</option>
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter Sidebar Mobile */}
      <FilterSidebarMobile
        filters={filters}
        availableCategories={availableCategories}
        availableBrands={availableBrands}
        availableConditions={availableConditions}
        availableColors={availableColors}
        availableMaterials={availableMaterials}
        availableGenres={availableGenres}
        onUpdateFilter={updateFilter}
        onClearFilters={clearFilters}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  );
};

export default BoutiqueMobile;