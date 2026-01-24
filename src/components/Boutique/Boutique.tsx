import React, { useState } from 'react';
import { Product } from '../../types';
import { useBoutique } from '../../hooks/useBoutique';
import { useAuth } from '../../contexts/AuthContext';
import BoutiqueHeader from './BoutiqueHeader';
import FilterSidebar from './FilterSidebar';
import Pagination from './Pagination';
import { ProductCard } from '../../features/products';
import ProductListView from './ProductListView';

interface BoutiqueProps {
  onAddToCart: (product: Product) => void;
  onProductClick: (productId: string) => void;
}

const Boutique: React.FC<BoutiqueProps> = ({ onAddToCart, onProductClick }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { userId } = useAuth();

  window.scrollTo(0, 0);
  
  const {
    filters,
    sortBy,
    viewMode,
    currentPage,
    itemsPerPage,
    totalPages,
    sortOptions,
    availableCategories,
    availableBrands,
    availableConditions,
    availableColors,
    availableMaterials,
    availableGenres,
    filteredProducts,
    totalResults,
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
    <div className="min-h-screen bg-white">
      <BoutiqueHeader
        resultsCount={resultsCount}
        sortBy={sortBy}
        sortOptions={sortOptions}
        viewMode={viewMode}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onSortChange={setSortBy}
        onViewModeChange={setViewMode}
        onFilterToggle={() => setIsFilterOpen(true)}
      />
      
      <div className="flex">
        <FilterSidebar
          filters={filters}
          availableCategories={availableCategories}
          brandsList={availableBrands}
          availableConditions={availableConditions}
          availableColors={availableColors}
          availableMaterials={availableMaterials}
          availableGenres={availableGenres}
          onUpdateFilter={updateFilter}
          onClearFilters={clearFilters}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />
        
        <main className="flex-1">
          <div className="p-4 md:p-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4 text-sm md:text-base">Chargement des produits...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4 text-sm md:text-base">Erreur: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-black text-white px-4 md:px-6 py-2 font-medium hover:bg-gray-800 transition-colors text-sm md:text-base"
              >
                Réessayer
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4 text-sm md:text-base">Aucun produit ne correspond à vos critères</p>
              <button
                onClick={clearFilters}
                className="bg-black text-white px-4 md:px-6 py-2 font-medium hover:bg-gray-800 transition-colors text-sm md:text-base"
              >
                Effacer les filtres
              </button>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={onAddToCart}
                      onProductClick={() => onProductClick(product.id)}
                      userId={userId}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-gray-200">
                  {filteredProducts.map((product) => (
                    <ProductListView
                      key={product.id}
                      product={product}
                      onProductClick={() => onProductClick(product.id)}
                      userId={userId}
                      onAddToCart={onAddToCart}
                    />
                  ))}
                </div>
              )}
            </>
          )}
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalResults={totalResults}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </main>
      </div>
    </div>
  );
};

export default Boutique;