import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, LogOut } from 'lucide-react';
import { User as UserType } from '../../types';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  currentPage: string;
  user?: UserType | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (page: string) => {
    switch (page) {
      case 'home':
        navigate('/');
        break;
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
    // Scroll vers le haut après navigation
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  };

  const handleUserClick = () => {
    if (user) {
      navigate('/profil');
    } else {
      navigate('/login');
    }
  };

  const isCurrentPage = (page: string): boolean => {
    switch (page) {
      case 'home':
        return location.pathname === '/';
      case 'about':
        return location.pathname === '/about';
      case 'selection':
        return location.pathname === '/selection';
      case 'sell':
        return location.pathname === '/vendre';
      case 'boutique':
        return location.pathname === '/boutique' || location.pathname.startsWith('/produit/');
      default:
        return false;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-[55]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 lg:h-20">
          {/* Mobile menu button */}
          <button 
            className="lg:hidden p-2 -ml-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
            <button 
              onClick={() => handleNavigation('home')}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <img
                src="/Logo_v2.webp"
                alt="Ligne Blanche Logo" 
                className="h-10 w-10 lg:h-12 lg:w-12 mr-3 object-contain"
              />
              <span className="text-xl lg:text-2xl font-bold tracking-tight text-black">
                LIGNE BLANCHE
              </span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center justify-center flex-1 space-x-8">
            <button 
              onClick={() => handleNavigation('home')}
              className={`hover:text-gray-600 transition-colors font-medium ${
                isCurrentPage('home') ? 'text-black border-b-2 border-black pb-1' : 'text-gray-900'
              }`}
            >
              ACCUEIL
            </button>
            <button 
              onClick={() => handleNavigation('about')}
              className={`hover:text-gray-600 transition-colors font-medium ${
                isCurrentPage('about') ? 'text-black border-b-2 border-black pb-1' : 'text-gray-900'
              }`}
            >
              NOTRE HISTOIRE
            </button>
            <button 
              onClick={() => handleNavigation('selection')}
              className={`hover:text-gray-600 transition-colors font-medium ${
                isCurrentPage('selection') ? 'text-black border-b-2 border-black pb-1' : 'text-gray-900'
              }`}
            >
              NOTRE SÉLECTION
            </button>
            <button 
              onClick={() => handleNavigation('sell')}
              className={`hover:text-gray-600 transition-colors font-medium ${
                isCurrentPage('sell') ? 'text-black border-b-2 border-black pb-1' : 'text-gray-900'
              }`}
            >
              VENDRE
            </button>
            <button 
              onClick={() => handleNavigation('boutique')}
              className={`hover:text-gray-600 transition-colors font-medium ${
                isCurrentPage('boutique') ? 'text-black border-b-2 border-black pb-1' : 'text-gray-900'
              }`}
            >
              BOUTIQUE
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            <button 
              onClick={handleUserClick}
              className="hidden sm:block hover:text-gray-600 transition-colors p-2 relative"
            >
              <User className="h-5 w-5" />
              {user && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-3 w-3"></span>
              )}
            </button>
            {/* Bouton déconnexion - visible seulement si connecté */}
            {user && onLogout && (
              <button 
                onClick={onLogout}
                className="hidden sm:block hover:text-red-600 transition-colors p-2"
                title="Se déconnecter"
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}
            <button 
              onClick={onCartClick}
              className="relative hover:text-gray-600 transition-colors p-2"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 w-80 h-full bg-white z-[60] lg:hidden transform transition-transform duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">LIGNE BLANCHE</h2>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <nav className="space-y-6">
                <button 
                  onClick={() => handleNavigation('home')}
                  className={`block w-full text-left font-medium text-lg ${
                    isCurrentPage('home') ? 'text-black' : 'text-gray-900'
                  }`}
                >
                  ACCUEIL
                </button>
                <button 
                  onClick={() => handleNavigation('about')}
                  className={`block w-full text-left font-medium text-lg ${
                    isCurrentPage('about') ? 'text-black' : 'text-gray-900'
                  }`}
                >
                  NOTRE HISTOIRE
                </button>
                <button 
                  onClick={() => handleNavigation('selection')}
                  className={`block w-full text-left font-medium text-lg ${
                    isCurrentPage('selection') ? 'text-black' : 'text-gray-900'
                  }`}
                >
                  NOTRE SÉLECTION
                </button>
                <button 
                  onClick={() => handleNavigation('sell')}
                  className={`block w-full text-left font-medium text-lg ${
                    isCurrentPage('sell') ? 'text-black' : 'text-gray-900'
                  }`}
                >
                  VENDRE
                </button>
                <button 
                  onClick={() => handleNavigation('boutique')}
                  className={`block w-full text-left font-medium text-lg ${
                    isCurrentPage('boutique') ? 'text-black' : 'text-gray-900'
                  }`}
                >
                  BOUTIQUE
                </button>
              </nav>
              
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => {
                      handleUserClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center w-12 h-12 border border-gray-300 hover:bg-gray-100 relative"
                  >
                    <User className="h-5 w-5" />
                    {user && (
                      <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-3 w-3"></span>
                    )}
                  </button>
                  {/* Bouton déconnexion mobile - visible seulement si connecté */}
                  {user && onLogout && (
                    <button 
                      onClick={() => {
                        onLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center w-12 h-12 border border-gray-300 hover:bg-red-50 hover:border-red-300 transition-colors"
                      title="Se déconnecter"
                    >
                      <LogOut className="h-5 w-5 text-red-600" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;