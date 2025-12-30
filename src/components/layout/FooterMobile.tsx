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
              LIGNE<span className="font-bold text-white ml-1">BLANCHE</span>
            </h3>
          </div>
          
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            Un héritage au service de votre passion. Chaque pièce est sélectionnée selon les critères les plus exigeants : authenticité, état irréprochable et histoire préservée.
          </p>
          
          
          {/* Social media - Mobile */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <span className="text-xs text-gray-400">Suivez-nous :</span>
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
          <h4 className="font-semibold mb-3 text-sm text-white text-center">Navigation</h4>
          <div className="grid grid-cols-2 gap-2 text-center">
            <button 
              onClick={() => handleNavigation('home')} 
              className="text-gray-300 hover:text-white transition-colors duration-300 text-xs py-1"
            >
              Accueil
            </button>
            <button 
              onClick={() => handleNavigation('boutique')} 
              className="text-gray-300 hover:text-white transition-colors duration-300 text-xs py-1"
            >
              Boutique
            </button>
            <button 
              onClick={() => handleNavigation('about')} 
              className="text-gray-300 hover:text-white transition-colors duration-300 text-xs py-1"
            >
              Notre Histoire
            </button>
            <button 
              onClick={() => handleNavigation('selection')} 
              className="text-gray-300 hover:text-white transition-colors duration-300 text-xs py-1"
            >
              Sélection
            </button>
            <button 
              onClick={() => handleNavigation('sell')} 
              className="text-gray-300 hover:text-white transition-colors duration-300 text-xs py-1"
            >
              Vendre vos Pièces
            </button>
          </div>
        </div>

        {/* Expertise section - Mobile compacte */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-sm text-white text-center">Notre expertise</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <Eye className="h-3 w-3 text-white mr-2 flex-shrink-0" />
              <div className="text-center">
                <p className="text-xs text-gray-300 font-medium">Authentification Certifié</p>
                <p className="text-xs text-gray-400">Garantie par des méthodes rigoureuses</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <Heart className="h-3 w-3 text-white mr-2 flex-shrink-0" />
              <div className="text-center">
                <p className="text-xs text-gray-300 font-medium">Sélection passionnée</p>
                <p className="text-xs text-gray-400">Moins de 3% des pièces évaluées</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white mr-2 flex-shrink-0" />
              <div className="text-center">
                <p className="text-xs text-gray-300 font-medium">Innovation respectueuse</p>
                <p className="text-xs text-gray-400">Héritage + codes modernes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section - Mobile */}
        <div className="border-t border-gray-800 pt-4 space-y-3">
          <div className="text-center text-gray-400 text-xs">
            © 2024 LIGNE BLANCHE. Tous droits réservés.
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={() => handleNavigation('legal')}
              className="text-gray-400 hover:text-white text-xs transition-colors duration-300"
            >
              Mentions Légales
            </button>
            <button 
              onClick={() => handleNavigation('privacy')}
              className="text-gray-400 hover:text-white text-xs transition-colors duration-300"
            >
              Confidentialité
            </button>
            <button 
              onClick={() => handleNavigation('terms')}
              className="text-gray-400 hover:text-white text-xs transition-colors duration-300"
            >
              Conditions
            </button>
            <button 
              onClick={() => handleNavigation('cookies')}
              className="text-gray-400 hover:text-white text-xs transition-colors duration-300"
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