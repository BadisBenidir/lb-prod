import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero, Features, BoutiqueHighlight, StoryPreview } from '../components/common';
import { ProductGrid } from '../features/products';
import { useProducts, useAvailableCategories } from '../hooks/useProducts';
import { useCartContext } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';


const HomePageDesktop: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { addToCart } = useCartContext();
  const { products } = useProducts();
  const { categories: availableCategories } = useAvailableCategories();

  const handleNavigation = (page: string) => {
    switch (page) {
      case 'boutique':
        navigate('/boutique');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'selection':
        navigate('/selection');
        break;
      case 'sell':
        navigate('/vendre');
        break;
      default:
        navigate('/');
    }
    window.scrollTo(0, 0);
  };

  const heroProducts = products
    .filter((p) => heroIds.includes(p.id))
    .sort((a, b) => heroIds.indexOf(a.id) - heroIds.indexOf(b.id));


  const heroIds = [
    "e2a0a467-21af-4747-8563-37a4a0fa7ba9",
    "413c5c99-60d3-40e8-9fa8-4f8c47b0724c",
    "4e4990d3-217f-40f5-942b-c2dfe6d417b5",
    "d7c2d6b4-aa3b-429a-a4c2-6cbe85297d0b",
  ];


  return (
    <main>
      <Hero onNavigate={handleNavigation} />
      <BoutiqueHighlight 
        onNavigateToBoutique={() => navigate('/boutique')}
        featuredProducts={heroProducts}
      />
      <ProductGrid 
        products={products}
        categories={['Tout', ...(availableCategories || [])]}
        onAddToCart={addToCart}
        userId={userId}
      />
      <StoryPreview 
        onNavigateToAbout={() => navigate('/about')}
        onNavigateToSell={() => navigate('/vendre')}
      />
      <Features onNavigate={handleNavigation} />
    </main>
  );
};

export default HomePageDesktop;