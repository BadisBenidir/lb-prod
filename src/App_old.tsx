import React from 'react';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header, Footer } from './components/layout';
import { Hero, Features, BoutiqueHighlight, StoryPreview } from './components/common';
import { ProductGrid } from './features/products';
import { Cart } from './features/cart';
import { LoginPage, RegisterPage } from './features/auth';
import { WelcomePage } from './pages/WelcomePage';
import { ProfileCompletionPage } from './pages/ProfileCompletionPage';
import Boutique from './components/Boutique/Boutique';
import ProductDetailPage from './components/Product/ProductDetailPage';
import ProfilePage from './components/Profile/ProfilePage';
import CheckoutPage from './components/Checkout/CheckoutPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import CheckoutCancelPage from './pages/CheckoutCancelPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AboutPage from './pages/AboutPage';
import SelectionPage from './pages/SelectionPage';
import SellPage from './pages/SellPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import LegalPage from './pages/LegalPage';
import CookiesPage from './pages/CookiesPage';
import { useCart } from './hooks/useCart';
import { useAuth } from './hooks/useAuth';
import { useProduct } from './hooks/useProduct';
import { useProducts, useAvailableCategories } from './hooks/useProducts';
import { AddToCartModal, AlreadyInCartModal } from './components/common';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'boutique' | 'product' | 'login' | 'register' | 'profile' | 'checkout' | 'checkout-success' | 'checkout-cancel' | 'welcome' | 'profile-completion' | 'order-confirmation' | 'about' | 'selection' | 'sell' | 'privacy' | 'terms' | 'legal' | 'cookies'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCompletingProfile, setIsCompletingProfile] = useState(false);
  const [stripeSessionId, setStripeSessionId] = useState<string | null>(null);

  // SEO Content State
  const [seoProps, setSeoProps] = useState({
    title: 'Ligne Blanche - L\'Œil Hérité',
    metaDescription: 'Découvrez ma collection de maroquinerie et prêt-à-porter de luxe de seconde main. Chaque pièce sélectionnée selon l\'expertise familiale héritée.'
  });
  
  const {
    user,
    customer,
    isLoading: authLoading,
    login,
    register,
    logout,
    updateProfile,
    updateCustomerProfile,
    checkAuthStatus,
    isProfileComplete
  } = useAuth();

  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    showAddToCartModal,
    showAlreadyInCartModal,
    addedProduct,
    isLoading: cartLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
    closeAddToCartModal,
    closeAlreadyInCartModal
  } = useCart(user?.id);

  const { product: selectedProduct, loading: productLoading, error: productError } = useProduct(selectedProductId);
  
  // Récupérer les produits et catégories depuis la base de données
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { categories: availableCategories } = useAvailableCategories();

  useEffect(() => {
    if (selectedProduct) {
      setSeoProps({
        title: `${selectedProduct.name} - Ligne Blanche`,
        metaDescription: selectedProduct.description.substring(0, 160) // Truncate for meta description
      });
    }
  }, [selectedProduct]);

  useEffect(() => {
    checkAuthStatus();
    
    // Gérer les redirections depuis Stripe
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    
    if (page === 'checkout-success') {
      // Récupérer le session_id AVANT de nettoyer l'URL
      const sessionId = urlParams.get('session_id');
      setStripeSessionId(sessionId);
      setCurrentPage('checkout-success');
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, '/');
    } else if (page === 'checkout-cancel') {
      setCurrentPage('checkout-cancel');
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  const handleNavigation = (page: 'home' | 'boutique' | 'about' | 'selection' | 'sell' | 'privacy' | 'terms' | 'legal' | 'cookies') => {
    setCurrentPage(page);
    if (page === 'boutique') {
      setSeoProps({
        title: 'Boutique - Ligne Blanche',
        metaDescription: 'Explorez notre collection de produits de luxe de seconde main.'
      });
    } else {
      setSeoProps({
        title: 'Ligne Blanche - L\'Œil Hérité',
        metaDescription: 'Découvrez ma collection de maroquinerie et prêt-à-porter de luxe de seconde main. Chaque pièce sélectionnée selon l\'expertise familiale héritée.'
      });
    }
    setSelectedProductId(null); // Reset selected product
    setIsCartOpen(false); // Fermer le panier lors de la navigation
    window.scrollTo(0, 0);
  };

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage('product');
    setIsCartOpen(false);
    window.scrollTo(0, 0);
  };

  const handleBackFromProduct = () => {
    setCurrentPage('boutique');
    setSelectedProductId(null);
    setSeoProps({
      title: 'Boutique - Ligne Blanche',
      metaDescription: 'Explorez notre collection de produits de luxe de seconde main.'
    });
    window.scrollTo(0, 0);
  };

  const handleUserIconClick = () => {
    setIsCartOpen(false); // Fermer le panier lors de l'accès au profil
    if (user) {
      setCurrentPage('profile');
    } else {
      setCurrentPage('login');
    }
  };

  const handleLogout = () => {
    logout();
    setIsCartOpen(false); // Fermer le panier lors de la déconnexion
    setCurrentPage('home');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentPage('checkout');
  };

  const handleBackFromCheckout = () => {
    setCurrentPage('home');
  };

  const handleOrderComplete = () => {
    // Clear cart after successful order
    cartItems.forEach(item => removeFromCart(item.id));
    setCurrentPage('checkout-success');
  };

  const handleReturnToCart = () => {
    setIsCartOpen(true);
  };

  const handleContinueShopping = () => {
    setCurrentPage('boutique');
    window.scrollTo(0, 0);
  };

  const handleCompleteProfile = async (profileData: any) => {
    setIsCompletingProfile(true);
    try {
      const result = await updateCustomerProfile(profileData);
      
      if (result.success) {
        setCurrentPage('profile');
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Erreur lors de la sauvegarde du profil' };
    } finally {
      setIsCompletingProfile(false);
    }
  };

  // Auth pages
  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          cartItemsCount={getTotalItems()}
          onCartClick={() => setIsCartOpen(true)}
          onNavigate={handleNavigation}
          currentPage={currentPage}
          user={user}
          onUserClick={handleUserIconClick}
        />
        <LoginPage
          onLogin={login}
          onNavigateToRegister={() => setCurrentPage('register')}
          onClose={() => setCurrentPage('home')}
          onLoginSuccess={() => setCurrentPage('profile')}
          isLoading={authLoading}
        />
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          totalPrice={getTotalPrice()}
         onCheckout={handleProceedToCheckout}
        />
        
        <AddToCartModal
          isOpen={showAddToCartModal}
          onClose={closeAddToCartModal}
          product={addedProduct}
        />
        
        <AlreadyInCartModal
          isOpen={showAlreadyInCartModal}
          onClose={closeAlreadyInCartModal}
          product={addedProduct}
        />
      </div>
    );
  }

  if (currentPage === 'register') {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          cartItemsCount={getTotalItems()}
          onCartClick={() => setIsCartOpen(true)}
          onNavigate={handleNavigation}
          currentPage={currentPage}
          user={user}
          onUserClick={handleUserIconClick}
        />
        <RegisterPage
          onRegister={register}
          onNavigateToLogin={() => setCurrentPage('login')}
          onClose={() => setCurrentPage('home')}
          onNavigateToWelcome={() => setCurrentPage('welcome')}
          isLoading={authLoading}
        />
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          totalPrice={getTotalPrice()}
         onCheckout={handleProceedToCheckout}
        />
        
        <AddToCartModal
          isOpen={showAddToCartModal}
          onClose={closeAddToCartModal}
          product={addedProduct}
        />
        
        <AlreadyInCartModal
          isOpen={showAlreadyInCartModal}
          onClose={closeAlreadyInCartModal}
          product={addedProduct}
        />
      </div>
    );
  }

  if (currentPage === 'profile' && user) {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          cartItemsCount={getTotalItems()}
          onCartClick={() => setIsCartOpen(true)}
          onNavigate={handleNavigation}
          currentPage={currentPage}
          user={user}
          onUserClick={handleUserIconClick}
        />
        <ProfilePage
          user={user}
          customer={customer}
          onUpdateProfile={updateProfile}
          onUpdateCustomerProfile={updateCustomerProfile}
          onLogout={handleLogout}
          onCompleteProfile={!isProfileComplete ? () => setCurrentPage('profile-completion') : undefined}
          isLoading={authLoading}
        />
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          totalPrice={getTotalPrice()}
         onCheckout={handleProceedToCheckout}
        />
      </div>
    );
  }

  if (currentPage === 'checkout') {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          cartItemsCount={getTotalItems()}
          onCartClick={() => setIsCartOpen(true)}
          onNavigate={handleNavigation}
          currentPage={currentPage}
          user={user}
          onUserClick={handleUserIconClick}
        />
        <CheckoutPage
          cartItems={cartItems}
          user={user}
          customer={customer}
          onBack={handleBackFromCheckout}
          onOrderComplete={handleOrderComplete}
          onClearCart={() => cartItems.forEach(item => removeFromCart(item.id))}
        />
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          totalPrice={getTotalPrice()}
          onCheckout={handleProceedToCheckout}
        />
        
        <AddToCartModal
          isOpen={showAddToCartModal}
          onClose={closeAddToCartModal}
          product={addedProduct}
        />
        
        <AlreadyInCartModal
          isOpen={showAlreadyInCartModal}
          onClose={closeAlreadyInCartModal}
          product={addedProduct}
        />
      </div>
    );
  }

  if (currentPage === 'welcome') {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          cartItemsCount={getTotalItems()}
          onCartClick={() => setIsCartOpen(true)}
          onNavigate={handleNavigation}
          currentPage={currentPage}
          user={user}
          onUserClick={handleUserIconClick}
        />
        <WelcomePage onCompleteProfile={() => setCurrentPage('profile-completion')} />
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          totalPrice={getTotalPrice()}
          onCheckout={handleProceedToCheckout}
        />
        
        <AddToCartModal
          isOpen={showAddToCartModal}
          onClose={closeAddToCartModal}
          product={addedProduct}
        />
        
        <AlreadyInCartModal
          isOpen={showAlreadyInCartModal}
          onClose={closeAlreadyInCartModal}
          product={addedProduct}
        />
      </div>
    );
  }

  if (currentPage === 'profile-completion') {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          cartItemsCount={getTotalItems()}
          onCartClick={() => setIsCartOpen(true)}
          onNavigate={handleNavigation}
          currentPage={currentPage}
          user={user}
          onUserClick={handleUserIconClick}
        />
        <ProfileCompletionPage 
          onComplete={handleCompleteProfile}
          onSkip={() => setCurrentPage('home')}
          isLoading={isCompletingProfile}
        />
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          totalPrice={getTotalPrice()}
          onCheckout={handleProceedToCheckout}
        />
      </div>
    );
  }

  if (currentPage === 'checkout-success') {
    return (
      <div className="min-h-screen bg-white">
        <CheckoutSuccessPage 
          onContinueShopping={handleContinueShopping}
          sessionId={stripeSessionId}
        />
      </div>
    );
  }

  if (currentPage === 'checkout-cancel') {
    return (
      <div className="min-h-screen bg-white">
        <CheckoutCancelPage 
          onReturnToCart={handleReturnToCart}
          onContinueShopping={handleContinueShopping}
        />
      </div>
    );
  }

  // New pages
  if (currentPage === 'about') {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          cartItemsCount={getTotalItems()}
          onCartClick={() => setIsCartOpen(true)}
          onNavigate={handleNavigation}
          currentPage={currentPage}
          user={user}
          onUserClick={handleUserIconClick}
        />
        <AboutPage />
        <Footer onNavigate={handleNavigation} />
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          totalPrice={getTotalPrice()}
          onCheckout={handleProceedToCheckout}
        />
      </div>
    );
  }

  if (currentPage === 'selection') {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          cartItemsCount={getTotalItems()}
          onCartClick={() => setIsCartOpen(true)}
          onNavigate={handleNavigation}
          currentPage={currentPage}
          user={user}
          onUserClick={handleUserIconClick}
        />
        <SelectionPage />
        <Footer onNavigate={handleNavigation} />
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          totalPrice={getTotalPrice()}
          onCheckout={handleProceedToCheckout}
        />
      </div>
    );
  }

  if (currentPage === 'sell') {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          cartItemsCount={getTotalItems()}
          onCartClick={() => setIsCartOpen(true)}
          onNavigate={handleNavigation}
          currentPage={currentPage}
          user={user}
          onUserClick={handleUserIconClick}
        />
        <SellPage />
        <Footer onNavigate={handleNavigation} />
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          totalPrice={getTotalPrice()}
          onCheckout={handleProceedToCheckout}
        />
      </div>
    );
  }

  if (currentPage === 'privacy') {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          cartItemsCount={getTotalItems()}
          onCartClick={() => setIsCartOpen(true)}
          onNavigate={handleNavigation}
          currentPage={currentPage}
          user={user}
          onUserClick={handleUserIconClick}
        />
        <PrivacyPage />
        <Footer onNavigate={handleNavigation} />
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          totalPrice={getTotalPrice()}
          onCheckout={handleProceedToCheckout}
        />
      </div>
    );
  }

  if (currentPage === 'terms') {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          cartItemsCount={getTotalItems()}
          onCartClick={() => setIsCartOpen(true)}
          onNavigate={handleNavigation}
          currentPage={currentPage}
          user={user}
          onUserClick={handleUserIconClick}
        />
        <TermsPage />
        <Footer onNavigate={handleNavigation} />
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          totalPrice={getTotalPrice()}
          onCheckout={handleProceedToCheckout}
        />
      </div>
    );
  }

  if (currentPage === 'legal') {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          cartItemsCount={getTotalItems()}
          onCartClick={() => setIsCartOpen(true)}
          onNavigate={handleNavigation}
          currentPage={currentPage}
          user={user}
          onUserClick={handleUserIconClick}
        />
        <LegalPage />
        <Footer onNavigate={handleNavigation} />
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          totalPrice={getTotalPrice()}
          onCheckout={handleProceedToCheckout}
        />
      </div>
    );
  }

  if (currentPage === 'cookies') {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          cartItemsCount={getTotalItems()}
          onCartClick={() => setIsCartOpen(true)}
          onNavigate={handleNavigation}
          currentPage={currentPage}
          user={user}
          onUserClick={handleUserIconClick}
        />
        <CookiesPage />
        <Footer onNavigate={handleNavigation} />
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          totalPrice={getTotalPrice()}
          onCheckout={handleProceedToCheckout}
        />
      </div>
    );
  }

  if (currentPage === 'product') {
    if (productLoading) {
      return (
        <div className="min-h-screen bg-white">
          <Header 
            cartItemsCount={getTotalItems()}
            onCartClick={() => setIsCartOpen(true)}
            onNavigate={handleNavigation}
            currentPage="boutique"
            user={user}
            onUserClick={handleUserIconClick}
          />
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-gray-500">Chargement du produit...</p>
          </div>
          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            totalPrice={getTotalPrice()}
            onCheckout={handleProceedToCheckout}
          />
        </div>
      );
    }

    if (productError || !selectedProduct) {
      return (
        <div className="min-h-screen bg-white">
          <Header 
            cartItemsCount={getTotalItems()}
            onCartClick={() => setIsCartOpen(true)}
            onNavigate={handleNavigation}
            currentPage="boutique"
            user={user}
            onUserClick={handleUserIconClick}
          />
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <p className="text-red-500 mb-4">
              {productError || 'Produit non trouvé'}
            </p>
            <button
              onClick={handleBackFromProduct}
              className="bg-black text-white px-6 py-2 font-medium hover:bg-gray-800 transition-colors"
            >
              Retour à la boutique
            </button>
          </div>
          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            totalPrice={getTotalPrice()}
            onCheckout={handleProceedToCheckout}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        <Header 
          cartItemsCount={getTotalItems()}
          onCartClick={() => setIsCartOpen(true)}
          onNavigate={handleNavigation}
          currentPage="boutique"
          user={user}
          onUserClick={handleUserIconClick}
        />
        <ProductDetailPage
          product={selectedProduct}
          onAddToCart={addToCart}
          onBack={handleBackFromProduct}
        />
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          totalPrice={getTotalPrice()}
          onCheckout={handleProceedToCheckout}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{seoProps.title}</title>
        <meta name="description" content={seoProps.metaDescription} />
      </Helmet>
      <Header 
        cartItemsCount={getTotalItems()}
        onCartClick={() => setIsCartOpen(true)}
        onNavigate={handleNavigation}
        currentPage={currentPage}
        user={user}
        onUserClick={handleUserIconClick}
      />
      
      {currentPage === 'home' ? (
        <main>
          <Hero onNavigate={handleNavigation} />
          <BoutiqueHighlight 
            onNavigateToBoutique={() => handleNavigation('boutique')}
            featuredProducts={products.slice(0, 4)}
          />
          <ProductGrid 
            products={products.slice(0, 6)}
            categories={['Tout', ...(availableCategories || [])]}
            onAddToCart={addToCart}
          />
          <StoryPreview 
            onNavigateToAbout={() => handleNavigation('about')}
            onNavigateToSell={() => handleNavigation('sell')}
          />
          <Features onNavigate={handleNavigation} />
        </main>
      ) : (
        <Boutique 
          onAddToCart={addToCart}
          onProductClick={handleProductClick}
        />
      )}
      
      <Footer onNavigate={handleNavigation} />
      
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        totalPrice={getTotalPrice()}
       onCheckout={handleProceedToCheckout}
      />
      
      <AddToCartModal
        isOpen={showAddToCartModal}
        onClose={closeAddToCartModal}
        product={addedProduct}
      />
      
      <AlreadyInCartModal
        isOpen={showAlreadyInCartModal}
        onClose={closeAlreadyInCartModal}
        product={addedProduct}
      />
    </div>
  );
}

export default App;
