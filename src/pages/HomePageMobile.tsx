import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero, Features, BoutiqueHighlight, StoryPreview } from '../components/common';
import { ProductGrid } from '../features/products';
import { useProducts, useAvailableCategories } from '../hooks/useProducts';
import { useCartContext } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import BoutiqueHighlightMobile from '../components/common/BoutiqueHighlightMobile';


const HomePageMobile: React.FC = () => {
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
    setTimeout(() => window.scrollTo(0, 0), 1000);
  };

  return (
    <main className="bg-white">
      <Hero onNavigate={handleNavigation} />
      <div className="px-3">
        <BoutiqueHighlightMobile
          featuredProducts={products}
          onNavigateToBoutique={() => navigate('/boutique')}
          onProductClick={(id) =>{
            window.scrollTo(0, 0);
            navigate(`/produit/${id}`);
          }} 
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
      </div>
    </main>
  );
};

export default HomePageMobile;