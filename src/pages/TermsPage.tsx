import { useEffect } from 'react';
import { FileText, ShoppingCart, Truck, CreditCard, Scale, AlertTriangle, Shield, Package, RefreshCw, Lock, BookOpen } from 'lucide-react';

export default function TermsPage() {
  useEffect(() => {
    document.title = 'Conditions Générales de Vente | Ligne Blanche';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <FileText className="h-8 w-8 text-yellow-500 mr-3" />
            <span className="text-yellow-500 text-sm font-medium uppercase tracking-wider">
              Conditions Contractuelles
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light mb-6 text-gray-900">
            Conditions Générales de Vente
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Conditions régissant la vente d'articles de mode et d'accessoires de luxe d'occasion sur notre boutique en ligne.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">

            {/* Article 1 - Objet */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Article 1 - Objet
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-4">
                  Les présentes Conditions Générales de Vente (ci-après les « CGV ») régissent les ventes
                  conclues entre Benidir Badis – Entreprise Individuelle, nom commercial Ligne Blanche,
                  et toute personne effectuant un achat sur le site www.ligne-blanche.fr.
                </p>
                <p className="text-gray-600">
                  Le Site propose la vente d'articles de mode et d'accessoires de luxe d'occasion.
                </p>
              </div>
            </div>

            {/* Article 2 - Identité du vendeur */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Article 2 - Identité du vendeur
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-2 text-gray-600">
                  <p><strong>Raison sociale :</strong> Benidir Badis – Entreprise Individuelle</p>
                  <p><strong>Nom commercial :</strong> Ligne Blanche</p>
                  <p><strong>Siège social :</strong> 61 Rue de Lyon, 75012 Paris, France</p>
                  <p><strong>SIREN :</strong> 932 255 557</p>
                  <p><strong>Email :</strong> sav@ligne-blanche.fr</p>
                </div>
              </div>
            </div>

            {/* Article 3 - Produits */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900 flex items-center">
                <ShoppingCart className="h-6 w-6 text-yellow-500 mr-3" />
                Article 3 - Produits
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Les produits proposés sont des articles d'occasion, pouvant présenter des traces d'usage.
                </p>
                <p>
                  Chaque article est décrit avec le plus de précision possible : photos, dimensions, état, matériaux.
                </p>
                <p>
                  Les photographies disponibles sur le site ont une valeur informative et non contractuelle.
                </p>
              </div>
            </div>

            {/* Article 4 - Authenticité */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900 flex items-center">
                <Shield className="h-6 w-6 text-yellow-500 mr-3" />
                Article 4 - Authenticité
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mb-6">
                <p className="text-gray-700 font-medium">
                  Chez Ligne Blanche, l'authenticité des pièces proposées est une priorité absolue.
                  Chaque article mis en vente fait l'objet d'un processus de vérification minutieux,
                  réalisé selon des critères stricts appliqués par les professionnels du secteur du luxe.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-4 text-gray-800">4.1. Contrôle interne complet</h3>
                  <p className="text-gray-600 mb-4">
                    Avant toute mise en ligne, chaque pièce est soumise à un examen détaillé comprenant :
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Inspection des matériaux (cuirs, toiles, métaux, tissus)</li>
                    <li>• Vérification des coutures et finitions</li>
                    <li>• Contrôle des logos, typographies, griffes et marquages</li>
                    <li>• Analyse des numéros de série, codes date, hologrammes ou estampilles</li>
                    <li>• Comparaison avec des modèles de référence</li>
                    <li>• Cohérence des dimensions, proportions et placements</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-4 text-gray-800">4.2. Traçabilité et origine</h3>
                  <p className="text-gray-600 mb-4">
                    Ligne Blanche sélectionne ses pièces auprès de :
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Collections privées</li>
                    <li>• Particuliers</li>
                    <li>• Professionnels du secteur</li>
                    <li>• Réseaux spécialisés dans les articles de mode de seconde main haut de gamme</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-4 text-gray-800">4.3. Vérification externe pour les pièces les plus haut de gamme</h3>
                  <p className="text-gray-600 mb-4">
                    Certaines pièces nécessitant un contrôle renforcé — notamment les articles de haute valeur
                    ou les modèles particulièrement demandés — font l'objet d'une expertise complémentaire.
                  </p>
                  <p className="text-gray-600">
                    Pour ces pièces, Ligne Blanche peut faire appel à une entreprise spécialisée indépendante, notamment :
                  </p>
                  <p className="text-gray-700 font-medium mt-3">
                    Le Petit Fermoir — Entreprise spécialisée dans la vérification approfondie de sacs et accessoires de luxe.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-4 text-gray-800">4.4. Clause de transparence et limites techniques</h3>
                  <p className="text-gray-600 mb-4">
                    L'authentification repose sur l'analyse d'éléments observables à un instant donné.
                    Malgré la rigueur du processus interne et externe, aucune méthode ne peut garantir une certitude absolue.
                  </p>
                  <p className="text-gray-600">
                    Ligne Blanche ne saurait être tenue responsable d'une erreur matérielle d'évaluation.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-4 text-gray-800">4.5. Engagement qualité</h3>
                  <p className="text-gray-600 mb-4">
                    Ligne Blanche s'engage à fournir :
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Des descriptions précises</li>
                    <li>• Des photographies fidèles</li>
                    <li>• Une transparence totale sur l'état réel des articles</li>
                    <li>• La possibilité de demander des photos supplémentaires</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Article 5 - Prix */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Article 5 - Prix
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Les prix affichés sont en euros (€), toutes taxes comprises.
                </p>
                <p>
                  Ils ne comprennent pas les éventuels frais de livraison, précisés avant la validation de la commande.
                </p>
              </div>
            </div>

            {/* Article 6 - Commandes */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Article 6 - Commandes
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Toute commande vaut acceptation pleine et entière des présentes CGV.
                </p>
                <p>
                  Le client reçoit un email récapitulatif une fois sa commande validée.
                </p>
              </div>
            </div>

            {/* Article 7 - Paiement */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900 flex items-center">
                <CreditCard className="h-6 w-6 text-yellow-500 mr-3" />
                Article 7 - Paiement
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4 text-gray-800">Moyens de paiement acceptés</h3>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li>• Carte bancaire (Visa, Mastercard, American Express)</li>
                  <li>• Apple Pay</li>
                </ul>

                <h3 className="text-xl font-medium mb-4 text-gray-800">Sécurité</h3>
                <p className="text-gray-600">
                  Le paiement est sécurisé via notre prestataire. Toutes les transactions sont protégées
                  par cryptage SSL et les données de paiement ne sont jamais stockées sur nos serveurs.
                </p>
              </div>
            </div>

            {/* Article 8 - Livraison */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900 flex items-center">
                <Truck className="h-6 w-6 text-yellow-500 mr-3" />
                Article 8 - Livraison
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4 text-gray-800">Mode de livraison</h3>
                <p className="text-gray-600 mb-6">
                  Les livraisons sont effectuées via <strong>Shop2Shop Chronopost</strong>.
                </p>

                <h3 className="text-xl font-medium mb-4 text-gray-800">Délais indicatifs</h3>
                <ul className="space-y-2 text-gray-600 mb-6">
                  <li>• <strong>France :</strong> 2 à 4 jours ouvrés</li>
                  <li>• <strong>Europe :</strong> 3 à 7 jours ouvrés</li>
                </ul>

                <h3 className="text-xl font-medium mb-4 text-gray-800">Suivi</h3>
                <p className="text-gray-600">
                  Le client reçoit un numéro de suivi à l'expédition.
                </p>
              </div>
            </div>

            {/* Article 9 - Droit de rétractation */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900 flex items-center">
                <RefreshCw className="h-6 w-6 text-yellow-500 mr-3" />
                Article 9 - Droit de rétractation (14 jours)
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  Le client dispose d'un délai légal de <strong>14 jours</strong> pour exercer son droit de rétractation
                  à compter de la réception du produit.
                </p>
                <p className="text-gray-700 mb-4">
                  L'article doit être retourné dans son état d'origine.
                </p>
                <p className="text-gray-700 font-medium">
                  Les frais de retour sont pris en charge par le Vendeur.
                </p>
              </div>
            </div>

            {/* Article 10 - Conditions des retours */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900 flex items-center">
                <Package className="h-6 w-6 text-yellow-500 mr-3" />
                Article 10 - Conditions des retours
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-4">
                  Le produit doit être retourné dans le même état que reçu, <strong>non porté, non lavé, non utilisé</strong>.
                </p>
                <p className="text-gray-600 mb-4">
                  Ligne Blanche peut refuser un retour si l'article revient endommagé, taché, ou dans un état différent.
                </p>
                <p className="text-gray-600">
                  Les frais de renvoi au client en cas de refus de retour sont à la charge du client.
                </p>
              </div>
            </div>

            {/* Article 11 - Remboursement */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Article 11 - Remboursement
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Le remboursement est effectué sous <strong>3 à 10 jours ouvrés</strong> après validation du retour.
                </p>
                <p>
                  Les frais de livraison initiaux ne sont pas remboursés.
                </p>
              </div>
            </div>

            {/* Article 12 - Garanties légales */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900 flex items-center">
                <Scale className="h-6 w-6 text-yellow-500 mr-3" />
                Article 12 - Garanties légales
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600">
                  Les articles bénéficient de la garantie légale de conformité et de la garantie des vices cachés,
                  conformément aux articles L.217-4 et suivants du Code de la consommation.
                </p>
              </div>
            </div>

            {/* Article 13 - Propriété intellectuelle */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900 flex items-center">
                <BookOpen className="h-6 w-6 text-yellow-500 mr-3" />
                Article 13 - Propriété intellectuelle
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Tous les contenus du site (photos, textes, logos…) sont protégés par le droit de la propriété intellectuelle.
                </p>
                <p>
                  Toute reproduction est interdite sans autorisation préalable.
                </p>
              </div>
            </div>

            {/* Article 14 - Données personnelles */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900 flex items-center">
                <Lock className="h-6 w-6 text-yellow-500 mr-3" />
                Article 14 - Données personnelles
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Les données sont traitées conformément au RGPD.
                </p>
                <p>
                  Toute demande doit être envoyée à <strong>sav@ligne-blanche.fr</strong>.
                </p>
              </div>
            </div>

            {/* Article 15 - Droit applicable */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Article 15 - Droit applicable
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600">
                  Les présentes CGV sont régies par le droit français.
                  En cas de litige, les tribunaux français sont seuls compétents,
                  sous réserve des règles de droit impératives.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Contact
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-4">
                  Pour toute question concernant ces CGV, vous pouvez nous contacter :
                </p>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Email :</strong> sav@ligne-blanche.fr</p>
                  <p><strong>Adresse :</strong> Ligne Blanche, 61 Rue de Lyon, 75012 Paris, France</p>
                </div>
              </div>
            </div>

            {/* Avertissement */}
            <div className="mb-12">
              <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
                  <h3 className="text-lg font-medium text-red-800">Important</h3>
                </div>
                <p className="text-red-700">
                  Ces conditions générales de vente sont susceptibles d'être modifiées.
                  La version en vigueur est celle accessible sur le site au moment de la commande.
                </p>
              </div>
            </div>

            <div className="text-center mt-16">
              <p className="text-sm text-gray-500">
                Dernière mise à jour : 01/12/2025
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
