import React, { useEffect } from 'react';
import { Eye, Heart, Smartphone, Handshake, Users, Instagram, Search, Award } from 'lucide-react';

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const milestones = [
    {
      year: '2013',
      title: 'Premiers repères',
      description: 'Découverte des codes du luxe et apprentissage des détails qui distinguent une pièce authentique.',
      icon: Eye
    },
    {
      year: '2015',
      title: 'L\'exigence se forme',
      description: 'Développement d\'une méthode de sélection rigoureuse : matières, finitions, intemporalité.',
      icon: Search
    },
    {
      year: '2018',
      title: 'Le Déclic Digital',
      description: 'Découverte d\'Instagram et Vinted. "Et si on pouvait faire mieux ? Toucher plus de monde ?"',
      icon: Smartphone
    },
    {
      year: '2020',
      title: 'Les Premiers Pas',
      description: 'Création du premier compte Instagram. Adapter l\'expertise physique au marché en ligne.',
      icon: Instagram
    },
    {
      year: '2022',
      title: 'Affirmation d\'une vision',
      description: 'Une identité claire émerge : rigueur, transparence et démocratisation du luxe de seconde main.',
      icon: Handshake
    },
    {
      year: '2024',
      title: 'Ligne Blanche Naît',
      description: 'L\'héritage réinventé : l\'expertise familiale rencontre l\'innovation digitale.',
      icon: Award
    }
  ];

  const values = [
    {
      icon: Eye,
      title: 'L\'Œil Hérité',
      description: 'Fruit d\'un héritage de codes et de savoir-faire, appliqué à chaque étape de la sélection pour assurer l\'authenticité et la qualité.'
    },
    {
      icon: Heart,
      title: 'La Passion Authentique',
      description: 'Pas de marketing ici. Juste l\'amour sincère des belles pièces et le respect de leur histoire.'
    },
    {
      icon: Smartphone,
      title: 'L\'Innovation Assumée',
      description: 'Quand la tradition rencontre le digital. Démocratiser l\'accès aux pièces d\'exception sans jamais transiger sur la qualité.'
    },
    {
      icon: Users,
      title: 'L\'Humain Avant Tout',
      description: 'Derrière chaque pièce, une histoire. Derrière chaque vente, une relation. C\'est notre différence.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <img
          src="/about-hero.webp"
          alt="Mains expertes examinant maroquinerie de luxe"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        
        <div className="relative z-10 text-left text-white max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4 sm:mb-6">
            <span className="text-gray-100 text-xs sm:text-sm font-medium tracking-wider uppercase">
              Notre Histoire
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-light mb-6 sm:mb-8 leading-tight">
            Deux générations,
            <span className="block font-bold text-white">Une passion</span>
          </h1>

          <div className="max-w-3xl">
            <p className="text-lg sm:text-xl md:text-2xl font-light leading-relaxed mb-4 sm:mb-6">
              <em>« Le regard d'hier, l'innovation d'aujourd'hui »</em>
            </p>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed">
              Quand l'expertise traditionnelle rencontre les outils digitaux modernes.
              Une histoire de transmission et de réinvention.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-4 sm:mb-6">
                La Genèse : Observer, Apprendre, Comprendre
              </h2>
              <div className="space-y-4 sm:space-y-6 text-gray-600 leading-relaxed">
                <p className="text-base sm:text-lg">
                  <em>« Chaque pièce porte son histoire, notre rôle est de lui offrir une seconde vie »</em>
                </p>
                <p className="text-sm sm:text-base">
                  Le luxe a toujours eu cette capacité rare : traverser le temps. Mais trop souvent, des pièces d'exception dorment dans des placards, oubliées, alors qu'elles portent encore l'élégance et le savoir-faire des grandes maisons.
                </p>
                <p className="text-sm sm:text-base">
                  Ligne Blanche est née de cette conviction : offrir une nouvelle vie à ces icônes, et les rendre accessibles à une nouvelle génération de passionnés. Chaque pièce que nous sélectionnons est choisie pour son authenticité, sa qualité et son intemporalité, afin qu'elle retrouve la place qu'elle mérite : la vôtre.
                </p>
                <p className="text-sm sm:text-base">
                  Nous croyons que le luxe ne doit pas être un monde fermé, réservé à quelques initiés. Il peut être transparent, exigeant, et surtout accessible. En proposant des articles vérifiés et certifiés, à des prix bien en dessous du marché, nous démocratisons l'accès aux grandes maisons sans jamais en trahir l'esprit.
                </p>
                <p className="text-sm sm:text-base">
                  Ligne Blanche, c'est une vision : faire de la mode de seconde main une expérience de confiance, où chaque pièce raconte une histoire et écrit la suite avec vous.
                </p>
              </div>
            </div>
            
            <div className="relative order-1 lg:order-2">
              <img
                src="/photos-site/sac-balenciaga.jpg"
                alt="Maroquinerie de luxe"
                className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="relative">
            {/* Timeline line - hidden on mobile */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-gray-800 via-gray-900 to-black"></div>
            
            {/* Mobile timeline line */}
            <div className="lg:hidden absolute left-6 top-0 w-1 h-full bg-gradient-to-b from-gray-800 via-gray-900 to-black"></div>
            
            <div className="space-y-8 sm:space-y-12 lg:space-y-16">
              {milestones.map((milestone, index) => {
                const IconComponent = milestone.icon;
                return (
                  <div key={milestone.year} className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Desktop layout */}
                    <div className={`hidden lg:block lg:w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                      <div className="bg-white p-6 xl:p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-center gap-3 mb-4">
                          {index % 2 === 0 ? (
                            <>
                              <div className="text-xl xl:text-2xl font-bold text-black">{milestone.year}</div>
                              <IconComponent className="w-5 h-5 xl:w-6 xl:h-6 text-gray-800" />
                            </>
                          ) : (
                            <>
                              <IconComponent className="w-5 h-5 xl:w-6 xl:h-6 text-gray-800" />
                              <div className="text-xl xl:text-2xl font-bold text-black">{milestone.year}</div>
                            </>
                          )}
                        </div>
                        <h3 className="text-lg xl:text-xl font-semibold text-gray-900 mb-3 xl:mb-4">{milestone.title}</h3>
                        <p className="text-gray-600 leading-relaxed text-sm xl:text-base">{milestone.description}</p>
                      </div>
                    </div>
                    
                    {/* Desktop timeline dot */}
                    <div className="hidden lg:flex relative z-10 w-10 h-10 xl:w-12 xl:h-12 bg-white rounded-full border-4 border-gray-800 shadow-lg items-center justify-center">
                      <IconComponent className="w-4 h-4 xl:w-6 xl:h-6 text-black" />
                    </div>
                    
                    <div className="hidden lg:block lg:w-1/2"></div>

                    {/* Mobile layout */}
                    <div className="lg:hidden flex items-start w-full">
                      <div className="relative z-10 w-12 h-12 bg-white rounded-full border-4 border-gray-800 shadow-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-black" />
                      </div>
                      <div className="ml-6 flex-1">
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="text-lg sm:text-xl font-bold text-black">{milestone.year}</div>
                          </div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">{milestone.title}</h3>
                          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{milestone.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Ce qui Nous Définit
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pas de beaux discours marketing. Juste ce qui fait notre différence, au quotidien.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {values.map((value) => (
              <div key={value.title} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 group hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mr-6 group-hover:bg-gray-200 transition-colors duration-300">
                    <value.icon className="h-8 w-8 text-gray-800" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">{value.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              L'Héritage Continue
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Aujourd'hui, Ligne Blanche conjugue exigence traditionnelle et innovation digitale. Une vision commune réinventée pour l'époque moderne.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl">
              <div className="flex items-center mb-6">
                <Eye className="w-8 h-8 text-gray-800 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">L'Expert Authentique</h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Un savoir-faire affûté, capable de distinguer l'authenticité dans chaque détail. L'assurance d'une sélection sans compromis.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl">
              <div className="flex items-center mb-6">
                <Smartphone className="w-8 h-8 text-gray-600 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">L'Innovateur Digital</h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Une approche moderne qui met le luxe à la portée de tous, en s'appuyant sur les outils digitaux et une communauté engagée.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Notre Promesse</h3>
            <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
              Chaque pièce est validée par une double exigence : authenticité et pertinence. C'est notre garantie qualité, notre signature sur chaque vente.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
