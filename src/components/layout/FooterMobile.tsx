import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram, Eye, Heart, Sparkles } from 'lucide-react';

const FooterMobile: React.FC = () => {
  const navigate = useNavigate();
  
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
      case 'privacy':
        navigate('/confidentialite');
        break;
      case 'terms':
        navigate('/conditions');
        break;
      case 'legal':
        navigate('/mentions-legales');
        break;
      case 'cookies':
        navigate('/cookies');
        break;
      default:
        navigate('/');
    }
    // Scroll vers le haut après navigation
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="px-4 py-8">
        {/* Brand section - Mobile */}
        <div className="text-center mb-6">
          <div className="mb-3">
            <h3 className="text-lg font-light tracking-wider">
              <span className="font-bold text-white ml-1">Ozë Paris</span>
            </h3>
          </div>
          
          <p className="font-sans text-gray-300 text-sm leading-relaxed mb-7">
            Un héritage au service d'une sélection irréprochable.
            Luxe. Sélection. Authenticité.
          </p>
          
          
          {/* Social media - Mobile */}
          <div className="flex items-center justify-center space-x-2 mb-9">
            <span className="font-sans text-gray-400 text-sm">
              Nous suivre :
            </span>
            <a
              href="https://www.instagram.com/ligne.blanche_?igsh=M3c0Y3JzOGxlMXFk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>

            <a
              href="https://www.vinted.fr/member/237668841"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-gray-400 hover:text-white transition-all duration-300"
              aria-label="Vinted"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.85 9 11 5.16-1.15 9-5.45 9-11V7l-10-5z"/>
                <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@ligne.blanche?_r=1&_t=ZN-91jXoDVs3l8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-all duration-300"
              aria-label="TikTok"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Navigation - Mobile compacte */}
        <div className="mb-6">
          <h4 className="font-sans font-semibold mb-4 text-sm text-white text-center">Navigation</h4>
          <div className="flex flex-row items-center justify-center gap-4">
            <button 
              onClick={() => handleNavigation('home')} 
              className="font-sans text-gray-300 hover:text-white transition-colors duration-300 text-xs py-1"
            >
              Boutique
            </button>
            <button 
              onClick={() => handleNavigation('about')} 
              className="font-sans text-gray-300 hover:text-white transition-colors duration-300 text-xs py-1"
            >
              Notre Histoire
            </button>
            <button 
              onClick={() => handleNavigation('selection')} 
              className="font-sans text-gray-300 hover:text-white transition-colors duration-300 text-xs py-1"
            >
              Sélection
            </button>
            <button 
              onClick={() => handleNavigation('sell')} 
              className="font-sans text-gray-300 hover:text-white transition-colors duration-300 text-xs py-1"
            >
              Vendre vos Pièces
            </button>
          </div>
        </div>

        {/* Bottom section - Mobile */}
        <div className="border-t border-gray-800 pt-4 space-y-3">
          <div className="font-sans text-center text-gray-400 text-xs">
            © 2024 OZË PARIS. Tous droits réservés.
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={() => handleNavigation('legal')}
              className="font-sans text-gray-400 hover:text-white text-xs transition-colors duration-300"
            >
              Mentions Légales
            </button>
            <button 
              onClick={() => handleNavigation('privacy')}
              className="font-sans text-gray-400 hover:text-white text-xs transition-colors duration-300"
            >
              Confidentialité
            </button>
            <button 
              onClick={() => handleNavigation('terms')}
              className="font-sans text-gray-400 hover:text-white text-xs transition-colors duration-300"
            >
              Conditions
            </button>
            <button 
              onClick={() => handleNavigation('cookies')}
              className="font-sans text-gray-400 hover:text-white text-xs transition-colors duration-300"
            >
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterMobile;