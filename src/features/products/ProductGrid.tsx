import React, { useState } from 'react';
import { Product } from '../../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  categories: string[];
  userId?: string | null;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, categories, userId }) => {
  const [selectedCategory, setSelectedCategory] = useState('Tout');

  // Mapping des catégories DB vers affichage UI
  const categoryDisplayMap: { [key: string]: string } = {
    'Sacs': 'Handbags',
    'Vetements': 'Ready-to-Wear',
    'Accessoires': 'Accessories',
    'Pochettes': 'Handbags',
    'Chaussures': 'Ready-to-Wear'
  };

  const filteredProducts = selectedCategory === 'Tout' 
    ? products 
    : products.filter(product => {
        // Si la catégorie sélectionnée correspond directement à une catégorie DB
        if (categories.includes(selectedCategory) && selectedCategory !== 'Tout') {
          return product.category === categoryDisplayMap[selectedCategory] || product.category === selectedCategory;
        }
        return false;
      });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">Ma Collection Sélectionnée</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base px-4">
          Chaque pièce a été authentifiée selon l'expertise héritée et sélectionnée 
          avec l'exigence de qualité transmise par papa.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12 px-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 md:px-6 py-2 text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-black text-white'
                : 'text-gray-600 hover:text-black border border-gray-300 hover:border-black'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            userId={userId}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;