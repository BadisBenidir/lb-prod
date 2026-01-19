import React, { useState } from 'react';
import { Product } from '../../types';
import ProductCard from './ProductCard';
import { Cpu } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  categories: string[];
  userId?: string | null;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, categories, userId }) => {
  const [selectedCategory, setSelectedCategory] = useState('Tout');

  console.log('[CAT] selectCategory =', selectedCategory);

  const categoryCounts = products.reduce((acc: Record<string, number>, p: any) => {
    const key = String(p.category);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  console.log('[CAT] counts =', categoryCounts);

  console.log('[CAT] sample categories =', products.slice(0, 10).map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    type: typeof p.category
  })));

  const filteredProducts = 
    selectedCategory === 'Tout' 
    ? products 
    : products.filter((product) => product.category === selectedCategory);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">Notre Collection Sélectionnée</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base px-4">
          Chaque pièce a été authentifiée selon une expertise très précise 
          <br />
          et sélectionnée avec exigence et qualité.
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