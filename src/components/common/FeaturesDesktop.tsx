import React from 'react';
import { Eye, Heart, Sparkles, ShoppingBag, Users, Shield } from 'lucide-react';

interface FeaturesDesktopProps {
  onNavigate?: (page: 'home' | 'boutique' | 'about' | 'selection' | 'sell') => void;
}

const FeaturesDesktop: React.FC<FeaturesDesktopProps> = ({ onNavigate }) => {
  const expertise = [
    {
      icon: Eye,
      title: 'L\'Œil Exigeant',
      description: 'Un regard attentif, forgé par la passion et l\'expérience, capable de repérer les signes distinctifs qui font la valeur d\'un véritable article de luxe.',
      highlight: '15 ans d\'expériences'
    },
    {
      icon: Heart,
      title: 'Sélection Passionnée',
      description: 'Moins de 3% des pièces évaluées rejoignent notre collection. Seul l\'exceptionnel mérite votre attention.',
      highlight: '<3% Sélectionné'
    },
    {
      icon: Sparkles,
      title: 'Modernité Assumée',
      description: 'Chaque pièce est sélectionnée pour allier style, qualité et impact réduit. Une approche innovante au service d\'une mode plus responsable.',
      highlight: 'Innovation respectueuse'
    }
  ];

  const services = [
    {
      icon: Shield,
      title: 'Authenticité Vérifiée',
      description: 'Chaque pièce est rigoureusement contrôlée et certifiée authentique.'
    },
    {
      icon: Users,
      title: 'Relation Personnalisée',
      description: 'Un contact direct avec moi, formé par la tradition du service familial.'
    },
    {
      icon: ShoppingBag,
      title: 'Livraison Sécurisée',
      description: 'Vos pièces d\'exception méritent un transport à la hauteur de leur valeur.'
    }
  ];

  return (
    <>
      {/* Expertise Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              Notre Approche
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Chaque pièce est choisie selon trois principes qui guident Ozë Paris : exigence, rareté et transparence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {expertise.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center group hover:bg-gray-50 p-6 rounded-xl transition-colors duration-300">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
                      <Icon className="h-8 w-8 text-gray-800" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{item.description}</p>
                  <div className="text-sm font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded-full inline-block">
                    {item.highlight}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={() => onNavigate?.('selection')}
              className="bg-gray-900 text-white px-8 py-4 font-medium hover:bg-gray-800 transition-colors rounded-lg"
            >
              Découvrir notre méthode de sélection
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              Nos engagements
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Offrir une expérience de confiance, à la hauteur des standards du luxe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="text-center bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                  <div className="flex justify-center mb-4">
                    <Icon className="h-8 w-8 text-gray-900" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturesDesktop;