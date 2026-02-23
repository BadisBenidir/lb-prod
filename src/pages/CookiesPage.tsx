import { useEffect } from 'react';
import { Cookie, Settings, Shield, Info, CheckCircle } from 'lucide-react';

export default function CookiesPage() {
  useEffect(() => {
    document.title = 'Politique des Cookies | Ozë Paris';
  }, []);

  const cookieTypes = [
    {
      name: 'Cookies techniques',
      description: 'Nécessaires au fonctionnement du site',
      examples: ['Session utilisateur', 'Préférences de langue', 'Panier d\'achat'],
      duration: 'Session',
      required: true
    },
    {
      name: 'Cookies analytiques',
      description: 'Pour analyser l\'utilisation du site',
      examples: ['Google Analytics', 'Statistiques de visite', 'Pages populaires'],
      duration: '13 mois',
      required: false
    },
    {
      name: 'Cookies marketing',
      description: 'Pour personnaliser les publicités',
      examples: ['Publicités ciblées', 'Réseaux sociaux', 'Partenaires publicitaires'],
      duration: '13 mois',
      required: false
    }
  ];

  return (
    <div className="font-sans min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Cookie className="h-8 w-8 text-yellow-500 mr-3" />
            <span className="text-yellow-500 text-sm font-medium uppercase tracking-wider">
              Gestion des Cookies
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light mb-6 text-gray-900">
            Politique des Cookies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez comment nous utilisons les cookies pour améliorer votre expérience sur notre site.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900 flex items-center">
                <Info className="h-6 w-6 text-yellow-500 mr-3" />
                Qu'est-ce qu'un cookie ?
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-4">
                  Un cookie est un petit fichier texte stocké sur votre ordinateur ou appareil mobile 
                  lorsque vous visitez un site web. Les cookies permettent au site de mémoriser 
                  vos actions et préférences (identifiant de connexion, langue, taille de police 
                  et autres paramètres d'affichage) pendant une durée déterminée.
                </p>
                <p className="text-gray-600">
                  Les cookies ne peuvent pas être utilisés pour exécuter des programmes 
                  ou introduire des virus sur votre ordinateur. Ils sont attribués à vous 
                  de manière unique et ne peuvent être lus que par un serveur web 
                  du domaine qui vous les a émis.
                </p>
              </div>
            </div>

            {/* Types de cookies */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Types de cookies utilisés
              </h2>
              <div className="space-y-6">
                {cookieTypes.map((type) => (
                  <div key={type.name} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                          {type.name}
                        </h3>
                        <p className="text-gray-600">{type.description}</p>
                      </div>
                      <div className="flex items-center">
                        {type.required ? (
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Obligatoire
                          </span>
                        ) : (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Optionnel
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Exemples :</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {type.examples.map((example, idx) => (
                            <li key={idx} className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Durée de conservation :</h4>
                        <p className="text-sm text-gray-600">{type.duration}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cookies tiers */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Cookies tiers
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-4">
                  Notre site peut également utiliser des cookies tiers pour :
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li>• <strong>Google Analytics :</strong> Analyse de l'audience et des performances du site</li>
                  <li>• <strong>Facebook Pixel :</strong> Suivi des conversions et publicités ciblées</li>
                  <li>• <strong>Stripe :</strong> Sécurisation des paiements</li>
                  <li>• <strong>YouTube :</strong> Intégration de vidéos</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Ces services tiers ont leurs propres politiques de confidentialité 
                  et de gestion des cookies.
                </p>
              </div>
            </div>

            {/* Gestion des cookies */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900 flex items-center">
                <Settings className="h-6 w-6 text-yellow-500 mr-3" />
                Comment gérer vos cookies ?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Via notre site</h3>
                  <p className="text-gray-600 mb-4">
                    Vous pouvez modifier vos préférences de cookies à tout moment 
                    en utilisant notre panneau de gestion des cookies.
                  </p>
                  <button className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors duration-300">
                    Gérer mes cookies
                  </button>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Via votre navigateur</h3>
                  <p className="text-gray-600 mb-4">
                    Vous pouvez également configurer votre navigateur pour refuser 
                    tous les cookies ou être informé quand un cookie est envoyé.
                  </p>
                  <p className="text-sm text-gray-500">
                    Note : La désactivation de certains cookies peut affecter 
                    le fonctionnement du site.
                  </p>
                </div>
              </div>
            </div>

            {/* Instructions par navigateur */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Instructions par navigateur
              </h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Chrome</h3>
                  <p className="text-sm text-gray-600">
                    Menu → Paramètres → Confidentialité et sécurité → Cookies et autres données de sites
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Firefox</h3>
                  <p className="text-sm text-gray-600">
                    Menu → Options → Vie privée et sécurité → Cookies et données de sites
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Safari</h3>
                  <p className="text-sm text-gray-600">
                    Safari → Préférences → Confidentialité → Gérer les données de sites web
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Edge</h3>
                  <p className="text-sm text-gray-600">
                    Menu → Paramètres → Cookies et autorisations de sites
                  </p>
                </div>
              </div>
            </div>

            {/* Impact de la désactivation */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Impact de la désactivation des cookies
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-800 mb-4">
                  Fonctionnalités qui pourraient être affectées :
                </h3>
                <ul className="space-y-2 text-yellow-700">
                  <li>• Connexion automatique à votre compte</li>
                  <li>• Mémorisation de vos préférences</li>
                  <li>• Sauvegarde de votre panier d'achat</li>
                  <li>• Personnalisation du contenu</li>
                  <li>• Statistiques d'utilisation</li>
                </ul>
              </div>
            </div>

            {/* Mise à jour */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Mise à jour de cette politique
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-4">
                  Cette politique des cookies peut être mise à jour périodiquement 
                  pour refléter les changements dans nos pratiques ou pour d'autres 
                  raisons opérationnelles, légales ou réglementaires.
                </p>
                <p className="text-gray-600">
                  Nous vous encourageons à consulter régulièrement cette page 
                  pour rester informé de notre utilisation des cookies.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900 flex items-center">
                <Shield className="h-6 w-6 text-yellow-500 mr-3" />
                Questions sur les cookies ?
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-4">
                  Si vous avez des questions concernant notre utilisation des cookies, 
                  n'hésitez pas à nous contacter :
                </p>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Email :</strong> sav@ligne-blanche.fr</p>
                  <p><strong>Adresse :</strong> Ozë Paris, 61 Rue de Lyon, 75012 Paris, France</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-16">
              <p className="text-sm text-gray-500">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
