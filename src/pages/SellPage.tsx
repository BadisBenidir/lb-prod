import { useEffect } from 'react';
import {
  Upload,
  CheckCircle,
  Euro,
  Shield,
  Clock,
  Star,
  Camera,
  Truck,
  Eye
} from 'lucide-react';

export default function SellPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Vendez à L\'Œil Hérité | Ozë Paris';
  }, []);

  const process = [
    {
      icon: <Camera size={40} />,
      title: 'Étape 1 : Envoyez-nous vos photos',
      description: 'Chaque article est analysé avec attention selon des critères précis de qualité et d\'authenticité.',
      details: [
        'Photos nettes et bien éclairées',
        'Tous les angles, détails et éventuels défauts',
        'Informations sur la provenance',
        'Première réponse sous 48h'
      ]
    },
    {
      icon: <Eye size={40} />,
      title: 'Étape 2 : Évaluation selon nos standards',
      description: 'Chaque pièce est ensuite évaluée selon nos standards : authenticité, état, rareté et potentiel de valorisation. Seules les pièces répondant à nos critères les plus exigeants intègrent la sélection Ozë Paris.',
      details: [
        'Vérification de l\'authenticité',
        'Classification selon nos critères internes',
        'Contrôle rigoureux de l\'état',
        'Sélection des pièces répondant à nos exigences de qualité'
      ]
    },
    {
      icon: <Truck size={40} />,
      title: 'Étape 3 : Envoi sécurisé pour expertise finale',
      description: 'Si la pré-évaluation est positive, nous organisons un envoi sécurisé pour expertise finale. Chaque étape est pensée pour garantir la sécurité et la traçabilité de votre article.',
      details: [
        'Dépôt simple dans le point relais le plus proche',
        'Transport assuré et suivi en temps réel',
        'Examen complet selon nos standards',
        'Documentation photographique à chaque étape'
      ]
    },
    {
      icon: <Euro size={40} />,
      title: 'Étape 4 : Estimation et proposition',
      description: 'Notre proposition reflète une analyse complète du marché et de l\'état de votre article. Nous vous garantissons une offre juste, claire et sans engagement.',
      details: [
        'Estimation basée sur l\'état réel et le marché actuel',
        'Proposition détaillée sous 48h après réception',
        'Paiement sous 24h si vous acceptez notre offre',
        'Retour gratuit de votre article si vous refusez'
      ]
    }
  ];

  const advantages = [
    {
      icon: <Eye size={32} />,
      title: 'Expertise Reconnue',
      description: 'Une équipe formée aux standards d\'évaluation du luxe d\'occasion, capable d\'identifier la valeur réelle de chaque pièce.'
    },
    {
      icon: <Clock size={32} />,
      title: 'Process Efficace',
      description: 'Un parcours simple et rapide : réponse sous 48h, proposition détaillée, paiement sous 24h après accord.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Transparence Totale',
      description: 'Prix justes basés sur le marché actuel, sans frais cachés. Chaque estimation est détaillée et motivée.'
    },
    {
      icon: <Truck size={32} />,
      title: 'Service Sécurisé',
      description: 'Transport assuré via point relais, suivi en temps réel, retour gratuit si vous refusez notre offre.'
    }
  ];

  const brands = [
    'Hermès', 'Chanel', 'Louis Vuitton', 'Dior', 'Gucci', 'Prada',
    'Bottega Veneta', 'Céline', 'Saint Laurent', 'Balenciaga',
    'Goyard', 'Loewe', 'Miu Miu', 'Chloé'
  ];

  const testimonials = [
    {
      name: 'Sophie L.',
      text: 'Process très clair et réactif. J\'ai reçu une proposition détaillée pour mon sac Chanel en 48h. Prix juste et paiement rapide.',
      rating: 5
    },
    {
      name: 'Antoine D.',
      text: 'Excellente expérience. L\'évaluation était précise, la communication transparente, et le dépôt en point relais très pratique.',
      rating: 5
    },
    {
      name: 'Marie T.',
      text: 'Équipe professionnelle et à l\'écoute. Ils ont su valoriser ma pièce Hermès au juste prix. Je recommande vivement.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src="/sell-hero.webp"
          alt="Expertise familiale en maroquinerie de luxe"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        
        <div className="relative z-10 text-left text-white max-w-5xl mx-auto px-4">
          <div className="mb-6">
            <span className="text-gray-100 text-sm font-medium tracking-wider uppercase">
              Vendez vos pièces de luxe
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-light mb-8 leading-tight">
            Donnez une seconde vie
            <span className="block font-bold text-white">à vos pièces d'exception</span>
          </h1>

          <div className="max-w-3xl">
            <p className="text-xl md:text-2xl font-light leading-relaxed mb-6">
              Un processus simple, transparent et sécurisé
            </p>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-8">
              Confiez-nous vos articles de luxe. Notre équipe d'experts évalue chaque pièce
              avec rigueur pour vous proposer le meilleur prix du marché.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-gray-300">
              <div className="flex items-center">
                <CheckCircle size={20} className="text-white mr-2" />
                Évaluation professionnelle
              </div>
              <div className="flex items-center">
                <CheckCircle size={20} className="text-white mr-2" />
                Transport assuré via point relais
              </div>
              <div className="flex items-center">
                <CheckCircle size={20} className="text-white mr-2" />
                Paiement sous 24h
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="block sm:hidden text-3xl font-light text-gray-900 mb-6">
              Comment vendre avec Ozë Paris ?
            </h2>
            <h2 className="hidden sm:block text-4xl font-light text-gray-900 mb-4">
              Comment vendre avec Ozë Paris ?
            </h2>
            <p className="block sm:hidden text-l text-gray-600 max-w-3xl mx-auto">
              De l'envoi de vos photos au paiement final, découvrez un processus
              pensé pour être simple, transparent et sécurisé à chaque étape.
            </p>
            <p className="hidden sm:block text-xl text-gray-600 max-w-3xl mx-auto">
              De l'envoi de vos photos au paiement final, découvrez un processus
              pensé pour être simple, transparent et sécurisé à chaque étape.
            </p>
          </div>
          
          <div className="space-y-16">
            {process.map((step, index) => (
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

      {/* Advantages Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center mb-16 text-gray-900">
            Pourquoi vendre avec Ozë Paris ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage) => (
              <div
                key={advantage.title}
                className="text-center p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-gray-800 mb-6 flex justify-center">
                  {advantage.icon}
                </div>
                <h3 className="text-lg font-medium mb-4 text-gray-900">
                  {advantage.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-light mb-8 text-gray-900">
            Les marques que nous valorisons
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Notre expertise se concentre sur les grandes maisons de luxe reconnues pour leur
            qualité et leur valeur sur le marché de l'occasion. Maroquinerie et prêt-à-porter uniquement.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {brands.map((brand) => (
              <span
                key={brand}
                className="bg-white px-6 py-3 text-gray-600 font-medium rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>



      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center mb-16 text-gray-900">
            Ils nous font confiance
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="text-center p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-gray-800 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="font-medium text-gray-900">
                  {testimonial.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light mb-6 text-gray-900">
              Prêt à vendre vos pièces ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Confiez-nous vos articles de luxe. Notre équipe d'experts vous accompagne
              à chaque étape pour vous garantir une transaction simple, sécurisée et au meilleur prix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
              <div className="flex items-center mb-6">
                <Eye className="w-8 h-8 text-gray-800 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">Expertise Rigoureuse</h3>
              </div>
              <p className="text-lg text-gray-700 mb-6">
                Notre équipe analyse chaque article selon des critères stricts d'authenticité,
                d'état et de valeur marchande pour vous proposer le prix le plus juste.
              </p>
              <div className="text-sm text-gray-600">
                ✓ Vérification de l'authenticité<br />
                ✓ Évaluation détaillée de l'état<br />
                ✓ Analyse du marché actuel
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <div className="flex items-center mb-6">
                <Upload className="w-8 h-8 text-gray-600 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">Processus Moderne</h3>
              </div>
              <p className="text-lg text-gray-700 mb-6">
                Un parcours entièrement digitalisé et sécurisé, pensé pour vous simplifier
                la vente tout en garantissant la protection de vos articles.
              </p>
              <div className="text-sm text-gray-600">
                ✓ Échange 100% en ligne<br />
                ✓ Transport assuré via point relais<br />
                ✓ Paiement sécurisé et rapide
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <a
              href="mailto:sav@ligne-blanche.fr"
              className="inline-block bg-gray-900 text-white px-8 py-4 font-medium hover:bg-gray-800 transition-colors duration-300 rounded-lg"
            >
              Commencer l'Évaluation
            </a>
            <p className="text-sm text-gray-600 mt-4">
              Réponse garantie sous 48h • Transport assuré • Sans engagement
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
