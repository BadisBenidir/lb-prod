import React from 'react';
import { ShoppingBag, Sparkles, ArrowDown } from 'lucide-react';

interface HeroMobileProps {
  onNavigate?: (page: 'home' | 'boutique' | 'about' | 'selection' | 'sell') => void;
}

const HeroMobile: React.FC<HeroMobileProps> = ({ onNavigate }) => {
  return (
    <section className="relative bg-gradient-to-b from-gray-900 to-black text-white h-screen overflow-hidden">
      {/* Animation (fond) */}
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover"
            style={{ objectPosition: "80% center" }}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="animv2.mp4" type="video/mp4" />
          </video>
        </div>

      {/* Gradient overlay - More dramatic for mobile */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>



      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 sm:pt-36 md:pt-44 lg:pt-52">
        {/* Main title - Optimized for mobile */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-light leading-tight mb-6 animate-slide-up">
            Acheter moins,
            <span className="block">choisir mieux,</span>
            <span className="block font-bold text-white">porter l'exception.</span>
          </h1>
        </div>

        {/* Quote - More prominent */}
        <div className="text-center mb-8 animate-fade-in delay-400">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 mx-2 border border-white/20">
            <p className="text-base text-gray-100 leading-relaxed">
              Découvrez une sélection exclusive de pièces
              <br className='block sm:hidden'/>
              de luxe de seconde main.
            </p>
          </div>
        </div>

        {/* CTA Buttons - Mobile optimized */}
        <div className="flex flex-col gap-3 mb-8 animate-slide-up delay-600">
          <button
            onClick={() => onNavigate?.('boutique')}
            className="bg-white text-black py-4 px-6 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingBag className="h-5 w-5 mr-3" />
            Découvrir la Boutique
          </button>
          <button
            onClick={() => onNavigate?.('about')}
            className="border-2 border-white text-white py-4 px-6 font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center text-base backdrop-blur-sm bg-black/20"
          >
            <Sparkles className="h-5 w-5 mr-3" />
            Notre Histoire
          </button>
        </div>

        {/* Stats - Redesigned for mobile */}
        <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in delay-800">
          <div className="text-center bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/10">
            <div className="text-xl font-bold text-white mb-1">&lt;3%</div>
            <p className="text-xs text-gray-300 leading-tight">sélection</p>
          </div>
          <div className="text-center bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/10">
            <div className="text-xl font-bold text-white mb-1">2-3x</div>
            <p className="text-xs text-gray-300 leading-tight">moins cher</p>
          </div>
          <div className="text-center bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/10">
            <div className="text-xl font-bold text-white mb-1">100%</div>
            <p className="text-xs text-gray-300 leading-tight">authenticité</p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center animate-bounce delay-1000">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 border border-white/30">
            <ArrowDown className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-600 {
          animation-delay: 0.6s;
        }
        .delay-800 {
          animation-delay: 0.8s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
};

export default HeroMobile;