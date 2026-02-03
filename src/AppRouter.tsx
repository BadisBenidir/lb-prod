import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useAuth } from './contexts/AuthContext';
import { useProfile } from './contexts/ProfileContext';
import { CartProvider, useCartContext } from './contexts/CartContext';

// Layout components
import { Header, Footer } from './components/layout';
import { Cart } from './features/cart';
import { AddToCartModal, AlreadyInCartModal, ProductSoldModal } from './components/common';

// Page components
import HomePage from './pages/HomePage';
import BoutiquePage from './pages/BoutiquePage';
import ProductDetailPage from './components/Product/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import SelectionPage from './pages/SelectionPage';
import SellPage from './pages/SellPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import LegalPage from './pages/LegalPage';
import CookiesPage from './pages/CookiesPage';

// Auth pages
import LoginPageWrapper from './pages/LoginPageWrapper';
import RegisterPageWrapper from './pages/RegisterPageWrapper';
import ProfilePageWrapper from './pages/ProfilePageWrapper';
import { WelcomePage } from './pages/WelcomePage';
import { ProfileCompletionPage } from './pages/ProfileCompletionPage';

// Checkout pages
import CheckoutPageWrapper from './components/Checkout/CheckoutPageWrapper';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import CheckoutCancelPage from './pages/CheckoutCancelPage';
import ScrollToTop from './components/ScrollToTop';

import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';


// Layout wrapper component
interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

// Wrapper pour ProductDetailPage avec accès aux fonctions du panier
const ProductDetailPageWrapper: React.FC = () => {
  return <ProductDetailPage />;
};

// Wrapper pour CheckoutSuccessPage qui extrait le session_id de l'URL
const CheckoutSuccessPageWrapper: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  
  const handleContinueShopping = () => {
    navigate('/boutique');
  };

  return (
    <CheckoutSuccessPage 
      sessionId={sessionId} 
      onContinueShopping={handleContinueShopping}
    />
  );
};

// Wrapper pour CheckoutCancelPage 
const CheckoutCancelPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleRetryCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/boutique');
  };

  return (
    <CheckoutCancelPage 
      onReturnToCart={handleRetryCheckout}
      onContinueShopping={handleContinueShopping}
    />
  );
};

// Wrapper pour WelcomePage
const WelcomePageWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleCompleteProfile = () => {
    navigate('/profil/completion');
  };

  const handleSkip = () => {
    navigate('/profil');
  };

  return (
    <WelcomePage 
      onCompleteProfile={handleCompleteProfile}
      onSkip={handleSkip}
    />
  );
};

const Layout: React.FC<LayoutProps> = ({ children, currentPage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const el = document.getElementById('app-scroll');
    if (el) {
      el.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [location.pathname]);

  const { logout } = useAuth();
  const { user, updateProfile, updateCustomerProfile } = useProfile();
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    showAddToCartModal,
    showAlreadyInCartModal,
    showProductSoldModal,
    addedProduct,
    soldProducts,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    closeAddToCartModal,
    closeAlreadyInCartModal,
    closeProductSoldModal
  } = useCartContext();
  

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        cartItemsCount={getTotalItems()}
        onCartClick={() => setIsCartOpen(!isCartOpen)}
        currentPage={currentPage}
        user={user}
        onLogout={user ? handleLogout : undefined}
      />

      <div
        id="app-scroll"
        className={`min-h-screen overflow-y-auto ${
          isHome ? "" : "pt-16 lg:pt-20"
        }`}
      >
        {children}
      </div>
      
      {currentPage !== 'login' && currentPage !== 'register' && currentPage !== 'checkout-success' && currentPage !== 'checkout-cancel' && (
        <Footer />
      )}
      
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
        onViewCart={() => setIsCartOpen(true)}
      />
      
      <AlreadyInCartModal
        isOpen={showAlreadyInCartModal}
        onClose={closeAlreadyInCartModal}
        product={addedProduct}
        onViewCart={() => setIsCartOpen(true)}
      />
      
      <ProductSoldModal
        isOpen={showProductSoldModal}
        onClose={closeProductSoldModal}
        soldProducts={soldProducts}
      />
    </div>
  );
};

// Protected Route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isAuthInitialized } = useAuth();
  
  if (!isAuthInitialized) {
    return <div>Chargement...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function AppRouter() {
  return (
    <HelmetProvider>
      <BrowserRouter>
          <ScrollToTop />
          <CartProvider>
            <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <Layout currentPage="home">
                  <Helmet>
                    <title>Ligne Blanche - Maison de Luxe de Seconde Main</title>
                    <meta name="description" content="Découvrez ma collection de maroquinerie et prêt-à-porter de luxe de seconde main. Chaque pièce sélectionnée selon l'expertise familiale héritée." />
                  </Helmet>
                  <HomePage />
                </Layout>
              } 
            />
          
            <Route 
              path="/boutique" 
              element={
                <Layout currentPage="boutique">
                  <Helmet>
                    <title>Boutique - Ligne Blanche</title>
                    <meta name="description" content="Explorez notre collection de produits de luxe de seconde main." />
                  </Helmet>
                  <BoutiquePage />
                </Layout>
              } 
            />
          
            <Route 
              path="/produit/:id" 
              element={
                <Layout currentPage="product">
                  <ProductDetailPageWrapper />
                </Layout>
              } 
            />
          
            <Route 
              path="/about" 
              element={
                <Layout currentPage="about">
                  <Helmet>
                    <title>Notre Histoire - Ligne Blanche</title>
                    <meta name="description" content="Découvrez l'histoire de Ligne Blanche et l'expertise familiale transmise de génération en génération." />
                  </Helmet>
                  <AboutPage />
                </Layout>
              } 
            />
          
            <Route 
              path="/selection" 
              element={
                <Layout currentPage="selection">
                  <Helmet>
                    <title>Notre Sélection - Ligne Blanche</title>
                    <meta name="description" content="Découvrez notre processus de sélection rigoureux et les critères d'expertise hérités." />
                  </Helmet>
                  <SelectionPage />
                </Layout>
              } 
            />
          
            <Route 
              path="/vendre" 
              element={
                <Layout currentPage="sell">
                  <Helmet>
                    <title>Vendre vos Pièces - Ligne Blanche</title>
                    <meta name="description" content="Vendez vos pièces de luxe en toute confiance grâce à notre expertise d'authentification." />
                  </Helmet>
                  <SellPage />
                </Layout>
              } 
            />
          
            {/* Legal Pages */}
            <Route 
              path="/confidentialite" 
              element={
                <Layout currentPage="privacy">
                  <Helmet>
                    <title>Politique de Confidentialité - Ligne Blanche</title>
                  </Helmet>
                  <PrivacyPage />
                </Layout>
              } 
            />
          
            <Route 
              path="/conditions" 
              element={
                <Layout currentPage="terms">
                  <Helmet>
                    <title>Conditions Générales - Ligne Blanche</title>
                  </Helmet>
                  <TermsPage />
                </Layout>
              } 
            />
          
            <Route 
              path="/mentions-legales" 
              element={
                <Layout currentPage="legal">
                  <Helmet>
                    <title>Mentions Légales - Ligne Blanche</title>
                  </Helmet>
                  <LegalPage />
                </Layout>
              } 
            />
          
            <Route 
              path="/cookies" 
              element={
                <Layout currentPage="cookies">
                  <Helmet>
                    <title>Politique des Cookies - Ligne Blanche</title>
                  </Helmet>
                  <CookiesPage />
                </Layout>
              } 
            />
          
            {/* Auth Routes */}
            <Route 
              path="/login" 
              element={
                <Layout currentPage="login">
                  <Helmet>
                    <title>Connexion - Ligne Blanche</title>
                  </Helmet>
                  <LoginPageWrapper />
                </Layout>
              } 
            />
          
            <Route 
              path="/register" 
              element={
                <Layout currentPage="register">
                  <Helmet>
                    <title>Inscription - Ligne Blanche</title>
                  </Helmet>
                  <RegisterPageWrapper />
                </Layout>
              } 
            />
          
            <Route 
              path="/welcome" 
              element={
                <Layout currentPage="welcome">
                  <Helmet>
                    <title>Bienvenue - Ligne Blanche</title>
                  </Helmet>
                  <WelcomePageWrapper />
                </Layout>
              } 
            />
          
            {/* Protected Routes */}
            <Route 
              path="/profil" 
              element={
                <ProtectedRoute>
                  <Layout currentPage="profile">
                    <Helmet>
                      <title>Mon Profil - Ligne Blanche</title>
                    </Helmet>
                    <ProfilePageWrapper />
                  </Layout>
                </ProtectedRoute>
              } 
            />
          
            <Route 
              path="/profil/completion" 
              element={
                <ProtectedRoute>
                  <Layout currentPage="profile-completion">
                    <Helmet>
                      <title>Compléter mon Profil - Ligne Blanche</title>
                    </Helmet>
                    <ProfileCompletionPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
          
            <Route 
              path="/checkout" 
              element={
                <Layout currentPage="checkout">
                  <Helmet>
                    <title>Commande - Ligne Blanche</title>
                  </Helmet>
                  <CheckoutPageWrapper />
                </Layout>
              } 
            />
          
            {/* Checkout Result Pages */}
            <Route 
              path="/checkout/success" 
              element={
                <Layout currentPage="checkout-success">
                  <Helmet>
                    <title>Commande Confirmée - Ligne Blanche</title>
                  </Helmet>
                  <CheckoutSuccessPageWrapper />
                </Layout>
              } 
            />
          
            <Route 
              path="/checkout/cancel" 
              element={
                <Layout currentPage="checkout-cancel">
                  <Helmet>
                    <title>Commande Annulée - Ligne Blanche</title>
                  </Helmet>
                  <CheckoutCancelPageWrapper />
                </Layout>
              } 
            />
          
            {/* 404 Route */}
            <Route 
              path="*" 
              element={
                <Layout currentPage="404">
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                      <p className="text-gray-600 mb-8">Page non trouvée</p>
                      <a 
                        href="/" 
                        className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors"
                      >
                        Retour à l'accueil
                      </a>
                    </div>
                  </div>
                </Layout>
              } 
            />
            </Routes>
          </CartProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default AppRouter;