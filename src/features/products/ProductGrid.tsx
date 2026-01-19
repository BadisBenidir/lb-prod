import React, { useState } from 'react';
import { Product } from '../../types';
import ProductCard from './ProductCard';
import { Cpu } from 'lucide-react';
import { products } from '../../data/products';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  categories: string[];
  userId?: string | null;
  homeToutIds?: string[];
}

  const HOME_TOUT_IDS = [
    "5c6b94e1-33c2-4b98-8a58-d2192ce2312a"
  ];


const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, categories, userId, homeToutIds = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('Tout');

  console.log('[GRID] products lenght =', products?.length);
  console.log('[GRID] categories prop =', categories);
  console.log('[GRID] sample product.category =', products?.slice(0, 8).map(p => p.category));

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
      ? products.filter(p => HOME_TOUT_IDS.includes(p.id))
      : products
        .filter(p => p.category === selectedCategory)
        .slice(0, 6);
  
  const categoryLabelMap: Record<string, string> = {
    Tout: 'Tout',
    Sacs: 'Sacs',
    Chaussures: 'Chaussures',
    Pochettes: 'Pochettes',
    Accessoires: 'Accessoires',
    Vetements: 'Vetements',
  }

  const CATEGORY_ORDER = [
    'Tout',
    'Sacs',
    'Chaussures',
    'Accessoires',
    'Pochettes',
    'Vetements',
  ];

  const orderCategories = CATEGORY_ORDER.filter(cat =>
    cat === 'Tout' || categories.includes(cat)
  );

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
        {orderCategories.map((category) => (
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