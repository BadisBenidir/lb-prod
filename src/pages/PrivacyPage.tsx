import React, { useEffect } from 'react';
import { Shield, Eye, Lock, Database, Cookie, UserCheck } from 'lucide-react';

export default function PrivacyPage() {
  useEffect(() => {
    document.title = 'Politique de Confidentialité | Ligne Blanche';
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-8 w-8 text-yellow-500 mr-3" />
            <span className="text-yellow-500 text-sm font-medium uppercase tracking-wider">
              Protection des Données
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light mb-6 text-gray-900">
            Politique de Confidentialité
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Nous nous engageons à protéger vos données personnelles et à respecter votre vie privée.
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
                <Eye className="h-6 w-6 text-yellow-500 mr-3" />
                Introduction
              </h2>
              <p className="text-gray-600 mb-4">
                Benidir Badis – Entreprise Individuelle, nom commercial Ligne Blanche,
                dont le siège social est situé 61 Rue de Lyon, 75012 Paris, France (SIREN : 932 255 557),
                accorde une grande importance à la protection de vos données personnelles.
              </p>
              <p className="text-gray-600">
                Cette politique de confidentialité vous informe de la manière dont nous collectons, 
                utilisons et protégeons vos données personnelles lorsque vous utilisez notre site web 
                et nos services.
              </p>
            </div>

            {/* Données collectées */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900 flex items-center">
                <Database className="h-6 w-6 text-yellow-500 mr-3" />
                Données personnelles collectées
              </h2>
              
              <h3 className="text-xl font-medium mb-4 text-gray-800">Données d'identification</h3>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <ul className="space-y-2 text-gray-600">
                  <li>• Nom et prénom</li>
                  <li>• Adresse email</li>
                  <li>• Numéro de téléphone</li>
                  <li>• Adresse postale</li>
                  <li>• Date de naissance (optionnelle)</li>
                </ul>
              </div>

              <h3 className="text-xl font-medium mb-4 text-gray-800">Données de navigation</h3>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <ul className="space-y-2 text-gray-600">
                  <li>• Adresse IP</li>
                  <li>• Type et version du navigateur</li>
                  <li>• Système d'exploitation</li>
                  <li>• Pages visitées et durée de visite</li>
                  <li>• Référent et page de sortie</li>
                </ul>
              </div>

              <h3 className="text-xl font-medium mb-4 text-gray-800">Données transactionnelles</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-2 text-gray-600">
                  <li>• Historique des commandes</li>
                  <li>• Montants des transactions</li>
                  <li>• Mode de paiement utilisé</li>
                  <li>• Statut des livraisons</li>
                </ul>
              </div>
            </div>

            {/* Finalités */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Finalités du traitement
              </h2>
              <p className="text-gray-600 mb-4">
                Nous utilisons vos données personnelles pour les finalités suivantes :
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-600">
                  <li>• <strong>Exécution des commandes :</strong> Traitement de vos commandes, paiements et livraisons</li>
                  <li>• <strong>Service client :</strong> Réponse à vos demandes et assistance</li>
                  <li>• <strong>Communication marketing :</strong> Envoi de newsletters et offres personnalisées (avec votre consentement)</li>
                  <li>• <strong>Amélioration des services :</strong> Analyse de l'utilisation du site pour optimiser l'expérience utilisateur</li>
                  <li>• <strong>Obligations légales :</strong> Respect des obligations comptables et fiscales</li>
                </ul>
              </div>
            </div>

            {/* Base légale */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Base légale du traitement
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-600">
                  <li>• <strong>Exécution du contrat :</strong> Pour traiter vos commandes et fournir nos services</li>
                  <li>• <strong>Consentement :</strong> Pour les communications marketing et l'utilisation de cookies</li>
                  <li>• <strong>Intérêt légitime :</strong> Pour améliorer nos services et prévenir la fraude</li>
                  <li>• <strong>Obligation légale :</strong> Pour respecter nos obligations comptables et fiscales</li>
                </ul>
              </div>
            </div>

            {/* Destinataires */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Destinataires des données
              </h2>
              <p className="text-gray-600 mb-4">
                Vos données personnelles peuvent être partagées avec :
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-600">
                  <li>• <strong>Prestataires de services :</strong> Transporteurs, prestataires de paiement, hébergeurs</li>
                  <li>• <strong>Autorités compétentes :</strong> Sur demande légale ou réglementaire</li>
                  <li>• <strong>Partenaires commerciaux :</strong> Uniquement avec votre consentement explicite</li>
                </ul>
              </div>
            </div>

            {/* Durée de conservation */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Durée de conservation
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-600">
                  <li>• <strong>Données de compte :</strong> 3 ans après la dernière activité</li>
                  <li>• <strong>Données de commande :</strong> 10 ans (obligation comptable)</li>
                  <li>• <strong>Données de navigation :</strong> 13 mois maximum</li>
                  <li>• <strong>Données marketing :</strong> 3 ans après le dernier contact</li>
                </ul>
              </div>
            </div>

            {/* Vos droits */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900 flex items-center">
                <UserCheck className="h-6 w-6 text-yellow-500 mr-3" />
                Vos droits
              </h2>
              <p className="text-gray-600 mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-600">
                  <li>• <strong>Droit d'accès :</strong> Connaître les données que nous détenons sur vous</li>
                  <li>• <strong>Droit de rectification :</strong> Corriger des données inexactes</li>
                  <li>• <strong>Droit à l'effacement :</strong> Demander la suppression de vos données</li>
                  <li>• <strong>Droit à la portabilité :</strong> Récupérer vos données dans un format structuré</li>
                  <li>• <strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données</li>
                  <li>• <strong>Droit de limitation :</strong> Limiter le traitement de vos données</li>
                </ul>
              </div>
            </div>

            {/* Cookies */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900 flex items-center">
                <Cookie className="h-6 w-6 text-yellow-500 mr-3" />
                Cookies
              </h2>
              <p className="text-gray-600 mb-4">
                Notre site utilise des cookies pour améliorer votre expérience utilisateur :
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-600">
                  <li>• <strong>Cookies techniques :</strong> Nécessaires au fonctionnement du site</li>
                  <li>• <strong>Cookies analytiques :</strong> Pour analyser l'utilisation du site</li>
                  <li>• <strong>Cookies marketing :</strong> Pour personnaliser les publicités</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.
                </p>
              </div>
            </div>

            {/* Sécurité */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900 flex items-center">
                <Lock className="h-6 w-6 text-yellow-500 mr-3" />
                Sécurité
              </h2>
              <p className="text-gray-600 mb-4">
                Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données :
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-600">
                  <li>• Chiffrement SSL/TLS pour les transmissions de données</li>
                  <li>• Accès restreint aux données personnelles</li>
                  <li>• Sauvegardes régulières et sécurisées</li>
                  <li>• Formation du personnel à la protection des données</li>
                  <li>• Surveillance continue des systèmes</li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Contact
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-4">
                  Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, 
                  vous pouvez nous contacter :
                </p>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Email :</strong> sav@ligne-blanche.fr</p>
                  <p><strong>Adresse :</strong> Ligne Blanche, 61 Rue de Lyon, 75012 Paris, France</p>
                </div>
                <p className="text-gray-600 mt-4">
                  Vous avez également le droit de déposer une plainte auprès de la CNIL 
                  (Commission Nationale de l'Informatique et des Libertés).
                </p>
              </div>
            </div>

            {/* Mise à jour */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Mise à jour de la politique
              </h2>
              <p className="text-gray-600">
                Cette politique de confidentialité peut être mise à jour périodiquement. 
                La version la plus récente sera toujours disponible sur notre site web. 
                Nous vous informerons de tout changement significatif par email ou via notre site.
              </p>
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
