import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram, Eye, Heart, Sparkles } from 'lucide-react';

const FooterDesktop: React.FC = () => {
  const navigate = useNavigate();
  
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
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-16 left-16 w-24 h-24 border border-white rotate-45"></div>
        <div className="absolute bottom-16 right-16 w-16 h-16 border border-white rotate-12"></div>
        <div className="absolute top-1/2 left-1/3 w-12 h-12 border border-white rotate-45"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand story section */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <h3 className="text-2xl font-light tracking-wider">
                <span className="font-bold text-white ml-1">LIGNE BLANCHE</span>
              </h3>
            </div>
            
            <p className="font-sans text-gray-300 mb-6 leading-relaxed text-base">
              Un héritage au service de votre passion. Chaque pièce est sélectionnée selon les critères
              les plus exigeants : authenticité, état irréprochable et histoire préservée.
            </p>
            
            
            {/* Social media */}
            <div className="flex items-center space-x-6">
              <span className="font-sans text-sm text-gray-400">Suivez-nous :</span>
              <a
                href="https://www.instagram.com/ligne.blanche_?igsh=M3c0Y3JzOGxlMXFk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 transform"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://www.vinted.fr/member/237668841"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 transform"
                aria-label="Vinted"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.85 9 11 5.16-1.15 9-5.45 9-11V7l-10-5z"/>
                  <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@ligne.blanche?_r=1&_t=ZN-91jXoDVs3l8"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 transform"
                aria-label="TikTok"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-sans font-semibold mb-6 text-lg text-white">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => handleNavigation('home')} 
                  className="font-sans text-gray-300 hover:text-white transition-colors duration-300 text-sm text-left block"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('boutique')} 
                  className="font-sans text-gray-300 hover:text-white transition-colors duration-300 text-sm text-left block"
                >
                  Boutique
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('about')} 
                  className="font-sans text-gray-300 hover:text-white transition-colors duration-300 text-sm text-left block"
                >
                  Notre Histoire
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('selection')} 
                  className="font-sans text-gray-300 hover:text-white transition-colors duration-300 text-sm text-left block"
                >
                  Sélection
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('sell')} 
                  className="font-sans text-gray-300 hover:text-white transition-colors duration-300 text-sm text-left block"
                >
                  Vendre vos Pièces
                </button>
              </li>
            </ul>
          </div>

          {/* Expertise section */}
          <div>
            <h4 className="font-sans font-semibold mb-6 text-lg text-white">Notre expertise</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <Eye className="h-4 w-4 text-white mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-sans text-sm text-gray-300 font-medium">Authentification Certifié</p>
                  <p className="font-sans text-xs text-gray-400">Garantie par des méthodes rigoureuses</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Heart className="h-4 w-4 text-white mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-sans text-sm text-gray-300 font-medium">Sélection passionnée</p>
                  <p className="font-sans text-xs text-gray-400">Moins de 3% des pièces évaluées</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Sparkles className="h-4 w-4 text-white mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-sans text-sm text-gray-300 font-medium">Innovation respectueuse</p>
                  <p className="font-sans text-xs text-gray-400">Héritage + codes modernes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="font-sans text-gray-400 text-sm">
            © 2024 LIGNE BLANCHE. Tous droits réservés.
          </div>
          
          <div className="flex flex-wrap justify-center lg:justify-end gap-6">
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

export default FooterDesktop;