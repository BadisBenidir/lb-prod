import React from 'react';
import { Eye, ArrowRight, Sparkles } from 'lucide-react';

interface StoryPreviewMobileProps {
  onNavigateToAbout?: () => void;
  onNavigateToSell?: () => void;
}

const StoryPreviewMobile: React.FC<StoryPreviewMobileProps> = ({ onNavigateToAbout, onNavigateToSell }) => {
  return (
    <section className="py-8 bg-gradient-to-b from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-12 left-4 w-24 h-24 bg-gray-300/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-12 right-4 w-20 h-20 bg-black/5 rounded-full blur-xl"></div>
      
      <div className="px-4 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-gray-100 backdrop-blur-sm border border-gray-300/30 rounded-full px-4 py-2 mb-4">
            <span className="text-gray-900 text-xs font-semibold tracking-wider uppercase">
              L'Histoire Authentique
            </span>
          </div>
          
          <h2 className="text-2xl font-light leading-tight mb-6 text-gray-900">
            Une conviction
            <span className="block font-bold text-black text-xl">simple</span>
          </h2>
        </div>

        {/* Visual Section */}
        <div className="mb-8 relative">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <img
              src="/story-gucci-bag.webp"
              alt="Expertise en maroquinerie de luxe"
              className="w-full h-64 object-cover"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {/* Overlay card */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
                <div className="flex items-start">
                  <div className="bg-gray-100 rounded-full p-2 mr-3 flex-shrink-0">
                    <Eye className="h-4 w-4 text-gray-800" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900 mb-1">Authenticité Renforcée</p>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      Les pièces les plus prestigieuses bénéficient d'une expertise externe pour vous fournir un certificat !
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Story Content */}
        <div className="space-y-4 text-gray-700 leading-relaxed mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm font-medium">
              Ligne Blanche est née d'une conviction simple : le luxe mérite une seconde vie.
            </p>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-700">
              Nous sélectionnons des pièces authentiques et intemporelles pour les rendre
              accessibles à une nouvelle génération, avec exigence et transparence.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button
            onClick={onNavigateToAbout}
            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 px-6 rounded-2xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Découvrir notre histoire
            <ArrowRight className="h-5 w-5 ml-3" />
          </button>
          
          <button
            onClick={onNavigateToSell}
            className="w-full border-2 border-gray-800 text-gray-800 py-4 px-6 rounded-2xl font-semibold hover:bg-gray-800 hover:text-white transition-all duration-300 flex items-center justify-center backdrop-blur-sm bg-white/50 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="h-5 w-5 mr-3" />
            VENDRE VOS PIÈCES
          </button>
        </div>
      </div>
    </section>
  );
};

export default StoryPreviewMobile;