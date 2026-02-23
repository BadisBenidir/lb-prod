import React from 'react';
import { Eye, ArrowRight, Sparkles } from 'lucide-react';

interface StoryPreviewDesktopProps {
  onNavigateToAbout?: () => void;
  onNavigateToSell?: () => void;
}

const StoryPreviewDesktop: React.FC<StoryPreviewDesktopProps> = ({ onNavigateToAbout, onNavigateToSell }) => {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Story Content */}
          <div className="order-2 lg:order-1">
            <div className="mb-6">
              <span className="text-gray-800 text-sm font-medium tracking-wider uppercase">
                L'Histoire Authentique
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-6 text-gray-900">
              Une conviction
              <span className="block font-bold text-black">simple</span>
            </h2>
            
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                OZË Paris est née d'une conviction simple : le luxe mérite une seconde vie.
              </p>

              <p>
                Nous sélectionnons des pièces authentiques et intemporelles pour les rendre
                accessibles à une nouvelle génération, avec exigence et transparence.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={onNavigateToAbout}
                className="bg-gray-900 text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                Découvrir notre histoire
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
              
              <button
                onClick={onNavigateToSell}
                className="border border-gray-900 text-gray-900 px-6 py-3 font-medium hover:bg-gray-900 hover:text-white transition-colors flex items-center justify-center"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                VENDRE VOS PIÈCES
              </button>
            </div>
          </div>
          
          {/* Visual */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative">
              <img
                src="/story-gucci-bag.webp"
                alt="Expertise en maroquinerie de luxe"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              
              {/* Overlay card */}
              <div className="absolute -bottom-6 -left-6 -translate-x-12 bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-xs">
                <div className="flex items-center mb-3">
                  <Eye className="h-5 w-5 text-gray-800 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Authenticité Renforcée</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Les pièces les plus prestigieuses bénéficient d'une expertise externe pour vous fournir un certificat !
                </p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gray-300/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoryPreviewDesktop;