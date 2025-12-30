import React, { useEffect } from 'react';
import { Search, Eye, Shield, Sparkles, CheckCircle, Users, Crown, Award } from 'lucide-react';

export default function SelectionPage() {
  useEffect(() => {
    document.title = 'L\'Œil hérité : Une sélection absolue | Ligne Blanche';
  }, []);

  const steps = [
    {
      icon: <Eye size={40} />,
      title: 'Le Regard Initial',
      description: 'Première sélection à l\'œil nu : matières, finitions et harmonie générale permettent de distinguer rapidement les pièces dignes d\'intérêt.',
      details: [
        'Reconnaissance immédiate des grandes maisons',
        'Identification des matières nobles',
        'Détection des détails incohérents',
        'Tri initial selon cohérence et style'
      ]
    },
    {
      icon: <Search size={40} />,
      title: 'L\'Analyse Approfondie',
      description: 'Chaque pièce est examinée avec précision : coutures, cuir, doublures et patines révèlent l\'histoire et l\'authenticité du produit.',
      details: [
        'Examen minutieux des coutures et finitions',
        'Vérification de la souplesse et de la patine',
        'Détection des signes d\'usure ou d\'altération',
        'Analyse globale de l\'équilibre et de la tenue'
      ]
    },
    {
      icon: <Shield size={40} />,
      title: 'La Validation d\'Authenticité',
      description: 'En collaboration avec notre réseau d\'authentificateurs partenaires, notamment « Le Petit Fermoir », chaque article est soumis à un contrôle strict afin de confirmer son authenticité selon des critères reconnus.',
      details: [
        'Contrôle rigoureux des codes de fabrication',
        'Classification selon des standards éprouvés',
        'Confirmation de l\'origine et de la conformité',
        'Validation croisée par méthode de comparaison'
      ]
    },
    {
      icon: <Sparkles size={40} />,
      title: 'La Sélection Définitive',
      description: 'Moins de 3 % des articles rencontrés intègrent notre collection. Une sélection stricte qui garantit authenticité et confiance.',
      details: [
        'Authenticité vérifiée, avec engagement de remboursement en cas de doute',
        'Aucun compromis sur la qualité',
        'Confiance et transparence comme principe fondateur',
        'Pièces retenues prêtes à rejoindre la collection'
      ]
    }
  ];

  const criteria = [
    {
      icon: <Eye size={32} />,
      title: 'L\'Œil du Détail',
      description: 'Chaque couture, chaque patine, chaque finition est scrutée avec précision.',
      percentage: '100%'
    },
    {
      icon: <Crown size={32} />,
      title: 'Maroquinerie de Prestige',
      description: 'Sélection centrée sur les pièces iconiques de maroquinerie et de prêt-à-porter de luxe.',
      percentage: '95%'
    },
    {
      icon: <Shield size={32} />,
      title: 'État Impeccable',
      description: 'Seules les pièces Neuves, en Excellent ou Très Bon état sont acceptées.',
      percentage: '3%'
    },
    {
      icon: <Users size={32} />,
      title: 'Histoire Vérifiée',
      description: 'Chaque pièce est validée pour son origine, sa traçabilité et sa légitimité.',
      percentage: '100%'
    }
  ];

  const values = [
    {
      title: 'L\'Héritage Assumé',
      description: 'Des méthodes éprouvées de sélection, appliquées avec constance et précision, pour garantir l\'authenticité et la qualité.',
      icon: <Eye size={48} />,
      color: 'text-gray-800 bg-gray-50'
    },
    {
      title: 'L\'Adaptation Moderne',
      description: 'Une exigence réinterprétée à l\'ère digitale : transparence, accessibilité et proximité avec une communauté grandissante.',
      icon: <Sparkles size={48} />,
      color: 'text-gray-600 bg-gray-50'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src="/selection-hero.webp"
          alt="Expertise en maroquinerie de luxe"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>

        <div className="relative z-10 text-left text-white max-w-5xl mx-auto px-4">
          <div className="mb-6">
            <span className="text-gray-100 text-sm font-medium tracking-wider uppercase">
              Ligne Blanche
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-light mb-8 leading-tight">
            L'œil hérité :
            <span className="block font-bold text-white">Une sélection absolue</span>
          </h1>

          <div className="max-w-3xl">
            <p className="text-xl md:text-2xl font-light leading-relaxed mb-6">
              <em>« La maroquinerie ne ment jamais. Chaque détail révèle son authenticité. »</em>
            </p>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              Guidée par des critères stricts et une attention portée à chaque détail : moins de 3% de sélection, zéro compromis sur la qualité.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">
                Une Méthode Patiente
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  La sélection d'une pièce de luxe n'est jamais le fruit du hasard. Elle repose sur une méthode patiente où chaque détail compte : la souplesse d'un cuir, la précision d'une couture, la profondeur d'une patine.
                </p>
                <p>
                  Observer, comparer, éliminer, recommencer — c'est ce processus qui forge une exigence sans concession.
                </p>
                <p>
                  Aujourd'hui, cette rigueur guide chacune de nos décisions. <strong>Notre engagement est simple</strong> : moins de 3 % des articles rencontrés sont retenus, parce que nous refusons tout compromis sur l'authenticité et la qualité.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/selection-method.webp"
                alt="Expertise en maroquinerie transmise"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-black rounded-2xl flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-2xl font-bold">&lt; 3%</div>
                  <div className="text-sm">Sélection</div>
                  <div className="text-xs">Rigoureuse</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center mb-16 text-gray-900">
            Notre Méthode en 4 Étapes
          </h2>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`flex flex-col lg:flex-row items-center gap-12 ${
                  index % 2 !== 0 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="lg:w-1/3 text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 text-gray-800 rounded-full mb-6">
                    {step.icon}
                  </div>
                  <div className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">
                    Étape {index + 1}
                  </div>
                  <h3 className="text-2xl font-light mb-4 text-gray-900">
                    {step.title}
                  </h3>
                </div>
                <div className="lg:w-2/3">
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    {step.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start">
                        <CheckCircle size={20} className="text-gray-800 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Classification Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-16 text-gray-900">
            Classification par État
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="text-center bg-white p-8 rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 text-purple-600 rounded-full mb-6">
                <Sparkles size={32} />
              </div>
              <h3 className="text-2xl font-light mb-4 text-purple-700">
                Neuf
              </h3>
            </div>
            <div className="text-center bg-white p-8 rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-full mb-6">
                <Crown size={32} />
              </div>
              <h3 className="text-2xl font-light mb-4 text-blue-700">
                Excellent
              </h3>
            </div>
            <div className="text-center bg-white p-8 rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
                <Award size={32} />
              </div>
              <h3 className="text-2xl font-light mb-4 text-green-700">
                Très Bon
              </h3>
            </div>
            <div className="text-center bg-white p-8 rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full mb-6">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-light mb-4 text-yellow-700">
                Bon
              </h3>
            </div>
            <div className="text-center bg-white p-8 rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 text-orange-600 rounded-full mb-6">
                <Shield size={32} />
              </div>
              <h3 className="text-2xl font-light mb-4 text-orange-700">
                Correct
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Criteria Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-16 text-gray-900">
            Nos Critères d'Excellence
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {criteria.map((criterion) => (
              <div
                key={criterion.title}
                className="text-center p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-gray-800 mb-6 flex justify-center">
                  {criterion.icon}
                </div>
                <div className="text-3xl font-light text-gray-900 mb-2">
                  {criterion.percentage}
                </div>
                <h3 className="text-lg font-medium mb-4 text-gray-900">
                  {criterion.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {criterion.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Notre Approche Héritée
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une méthode fondée sur l'exigence traditionnelle et adaptée aux codes modernes. Entre rigueur et innovation, c'est l'équilibre qui définit Ligne Blanche.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {values.map((value) => (
              <div key={value.title} className={`p-8 rounded-2xl ${value.color} border-2 border-transparent hover:border-gray-200 transition-all duration-300`}>
                <div className="flex items-center mb-6">
                  <div className="mr-6">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{value.title}</h3>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Notre Signature</h3>
            <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
              Chaque pièce de la collection répond à un double standard : authenticité et état irréprochable, selon une méthode stricte et une présentation adaptée aux codes actuels. C'est notre promesse de qualité et notre engagement au service de votre confiance.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-light mb-12">
            L'Excellence en Chiffres
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-light text-white mb-2">
                10
              </div>
              <p className="text-sm text-gray-300">
                Années de savoir-faire cumulées
              </p>
            </div>
            <div>
              <div className="text-4xl font-light text-white mb-2">
                &lt; 3%
              </div>
              <p className="text-sm text-gray-300">
                Taux de sélection appliqué
              </p>
            </div>
            <div>
              <div className="text-4xl font-light text-white mb-2">
                100%
              </div>
              <p className="text-sm text-gray-300">
                Authenticité vérifiée et garantie
              </p>
            </div>
            <div>
              <div className="text-4xl font-light text-white mb-2">
                0
              </div>
              <p className="text-sm text-gray-300">
                Compromis sur la qualité
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-light mb-6 text-gray-900">
            Découvrez Notre Sélection Héritée
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Chaque pièce de la collection répond à des standards stricts : authenticité contrôlée, état irréprochable, sélection exigeante. Découvrez des articles de maroquinerie et prêt-à-porter de luxe de seconde main, sélectionnés avec la plus grande rigueur.
          </p>
          <a
            href="/boutique"
            className="inline-block bg-gray-900 text-white px-8 py-4 font-medium hover:bg-gray-800 transition-colors duration-300 rounded-lg"
          >
            Découvrir Notre Collection
          </a>
        </div>
      </section>
    </div>
  );
}