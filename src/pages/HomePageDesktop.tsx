import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero, Features, BoutiqueHighlight, StoryPreview } from '../components/common';
import { ProductGrid } from '../features/products';
import { useProducts, useAvailableCategories } from '../hooks/useProducts';
import { useCartContext } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext'
import { BOUTIQUE_HIGHLIGHT_IDS } from '../components/common/highlight';
import BoutiqueHighlightDesktop from '../components/common/BoutiqueHighlightDesktop';


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

  const highlightedProducts = products
    .filter(p => BOUTIQUE_HIGHLIGHT_IDS.includes(p.id))
    .slice(0, 4);

  return (
    <main>
      <Hero onNavigate={handleNavigation} />
      <BoutiqueHighlightDesktop 
        featuredProducts={highlightedProducts}
        onNavigateToBoutique={() => navigate('/boutique')}
        onProductClick={(id) => {
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
    </main>
  );
};

export default HomePageDesktop;