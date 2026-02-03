import React from 'react';
import { Eye, Heart, Sparkles, ShoppingBag, Users, Shield, ArrowRight } from 'lucide-react';

interface FeaturesMobileProps {
  onNavigate?: (page: 'home' | 'boutique' | 'about' | 'selection' | 'sell') => void;
}

const FeaturesMobile: React.FC<FeaturesMobileProps> = ({ onNavigate }) => {
  const expertise = [
    {
      icon: Eye,
      title: 'L\'Œil Exigeant',
      description: 'Un regard attentif, forgé par la passion et l\'expérience, capable de repérer les signes distinctifs qui font la valeur d\'un véritable article de luxe.',
      highlight: '15 ans d\'expériences',
      color: 'from-gray-800 to-black'
    },
    {
      icon: Heart,
      title: 'Sélection Passionnée',
      description: 'Moins de 3% des pièces évaluées rejoignent notre collection. Seul l\'exceptionnel mérite votre attention.',
      highlight: '<3% Sélectionné',
      color: 'from-gray-700 to-gray-900'
    },
    {
      icon: Sparkles,
      title: 'Modernité Assumée',
      description: 'Chaque pièce est sélectionnée pour allier style, qualité et impact réduit. Une approche innovante au service d\'une mode plus responsable.',
      highlight: 'Innovation respectueuse',
      color: 'from-gray-600 to-gray-800'
    }
  ];

  const services = [
    {
      icon: Shield,
      title: 'Authenticité Vérifiée',
      description: 'Chaque pièce est rigoureusement contrôlée et certifiée authentique.',
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-800',
      borderColor: 'border-gray-200'
    },
    {
      icon: Users,
      title: 'Relation Personnalisée',
      description: 'Un contact direct avec nous, formé par la tradition du service familial.',
      bgColor: 'bg-gray-100',
      iconColor: 'text-black',
      borderColor: 'border-gray-300'
    },
    {
      icon: ShoppingBag,
      title: 'Livraison Sécurisée',
      description: 'Vos pièces d\'exception méritent un transport à la hauteur de leur valeur.',
      bgColor: 'bg-white',
      iconColor: 'text-gray-900',
      borderColor: 'border-gray-200'
    }
  ];

  return (
    <>
      {/* Services Section */}
      <section className="py-8 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-8 left-4 w-24 h-24 bg-gray-300/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-8 right-4 w-16 h-16 bg-black/5 rounded-full blur-xl"></div>
        
        <div className="px-4 relative">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-light text-gray-1000 mb-5">
              Notre engagement
            </h2>
            <p className="text-base text-gray-600 leading-relaxed max-w-sm mx-auto">
              Offrir une expérience de confiance, à la hauteur des standards du luxe.
            </p>
          </div>
          
          {/* Services Cards */}
          <div className="space-y-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div 
                  key={index} 
                  className={`${service.bgColor} rounded-2xl p-5 border ${service.borderColor} shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.01]`}
                >
                  <div className="flex items-start">
                    <div className="bg-white rounded-xl p-2 mr-4 flex-shrink-0 shadow-sm">
                      <Icon className={`h-5 w-5 ${service.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold mb-2 text-gray-900">{service.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturesMobile;