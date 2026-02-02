import React from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';

interface HeroDesktopProps {
  onNavigate?: (page: 'home' | 'boutique' | 'about' | 'selection' | 'sell') => void;
}

const HeroDesktop: React.FC<HeroDesktopProps> = ({ onNavigate }) => {
  return (
    <section className="relative h-[85vh] md:h-[90vh] w-full overflow-hidden">
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
          <source src="/0202.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Overlay léger pour lisibilité */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />

      {/* Contenu par-dessus */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-col justify-end pb-10">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-black">
            Ligne Blanche
          </h1>
          <p className="text-sm md:text-base text-gray-700 max-w-lg">
            Pièces sélectionnées. Prix justes. Drops réguliers.
          </p>
          <button
            onClick={() => document.getElementById("home-content")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex w-fit items-center rounded-xl bg-black text-white px-5 py-3 text-sm font-semibold"
          >
            Découvrir
          </button>
        </div>
      </div>
    </section>
  );
  return (

    <section className="relative bg-gradient-to-br from-gray-50 to-white min-h-[80vh] md:min-h-[90vh] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Contenu texte à gauche */}
          <div className="max-w-2xl">
            <div className="flex items-center mb-6">
              <span className="text-gray-600 text-sm font-medium tracking-wider uppercase">
                Ligne Blanche
              </span>
            </div>

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
              <div className="border-l-2 border-gray-300 pl-4 text-left">
                <div className="text-2xl font-light text-gray-900 mb-1">&lt;3%</div>
                <p className="text-sm text-gray-600">de sélection rigoureuse</p>
              </div>
              <div className="border-l-2 border-gray-300 pl-4 text-left">
                <div className="text-2xl font-light text-gray-900 mb-1">2-3x</div>
                <p className="text-sm text-gray-600">moins cher que la concurrence</p>
              </div>
              <div className="border-l-2 border-gray-300 pl-4 text-left">
                <div className="text-2xl font-light text-gray-900 mb-1">100%</div>
                <p className="text-sm text-gray-600">authenticité garantie</p>
              </div>
            </div>
          </div>

          {/* Image dans un cadre à droite */}
          <div className="relative">
            <div className="relative bg-white p-4 shadow-2xl">
              <div className="relative overflow-cover" style={{ aspectRatio: '4/5' }}>
                <img
                  src="/hero-main.webp"
                  alt="Expertise en maroquinerie de luxe"
                  className="w-full h-full object-cover"
                />
                {/* Overlay subtil optionnel */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-50"></div>
              </div>
              {/* Légende sous l'image */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 uppercase tracking-wider">Collection Exclusive</p>
                <p className="text-xs text-gray-500 mt-1">Sélection Ligne Blanche</p>
              </div>
            </div>

            {/* Éléments décoratifs */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-gray-200 -z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gray-100 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroDesktop;
