import React from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';

interface HeroDesktopProps {
  onNavigate?: (page: 'home' | 'boutique' | 'about' | 'selection' | 'sell') => void;
}

const HeroDesktop: React.FC<HeroDesktopProps> = ({ onNavigate }) => {
  return (
    <section
      id='hero'
      className="relative bg-gradient-to-br from-gray-50 to-white min-h-[80vh] md:min-h-[90vh] overflow-hidden"
    >
      {/* Animation (fond) */}
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="0202.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Overlay léger pour lisibilité */}
        <div className="absolute inset-x-0 bottom-0 top-16 bg-gradient-to-t from-white/30 via-white/10 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 pt-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Contenu texte à gauche */}
          <div className="max-w-2xl mt-20 lg:mt-28">

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6 text-gray-900">
              Acheter moins,
              <span className="block">choisir mieux,</span>
              <span className="block font-bold text-black">porter l'exception.</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
              Découvrez une sélection exclusive de pièces de luxe de seconde main choisies avec exigence et certifiées authentiques.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={() => onNavigate?.('boutique')}
                className="bg-black text-white px-8 py-4 font-medium hover:bg-gray-900 transition-colors flex items-center justify-center text-base"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Découvrir la Boutique
              </button>
              <button
                onClick={() => onNavigate?.('about')}
                className="border-2 border-black text-black px-8 py-4 font-medium hover:bg-black hover:text-white transition-colors flex items-center justify-center text-base"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Notre Histoire
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="border-l-2 border-black pl-4 text-left">
                <div className="text-2xl font-light text-gray-900 mb-1">&lt;3%</div>
                <p className="text-sm text-gray-600">de sélection rigoureuse</p>
              </div>
              <div className="border-l-2 border-black pl-4 text-left">
                <div className="text-2xl font-light text-gray-900 mb-1">2-3x</div>
                <p className="text-sm text-gray-600">moins cher que la concurrence</p>
              </div>
              <div className="border-l-2 border-black pl-4 text-left">
                <div className="text-2xl font-light text-gray-900 mb-1">100%</div>
                <p className="text-sm text-gray-600">authenticité garantie</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroDesktop;
