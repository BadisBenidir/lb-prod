import { useEffect } from 'react';
import { Building, User, Mail, MapPin, FileText, Globe } from 'lucide-react';

export default function LegalPage() {
  useEffect(() => {
    document.title = 'Mentions Légales | Ozë Paris';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <FileText className="h-8 w-8 text-yellow-500 mr-3" />
            <span className="font-sans text-yellow-500 text-sm font-medium uppercase tracking-wider">
              Informations Légales
            </span>
          </div>
          <h1 className="font-sans text-4xl md:text-5xl font-light mb-6 text-gray-900">
            Mentions Légales
          </h1>
          <p className="font-sans text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Informations légales concernant Ozë Paris et son site web.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">

            {/* Éditeur */}
            <div className="font-sans mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900 flex items-center">
                <Building className="h-6 w-6 text-yellow-500 mr-3" />
                Éditeur du site
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-3 text-gray-600">
                  <p><strong>Raison sociale :</strong> Benidir Badis – Entreprise Individuelle</p>
                  <p><strong>Nom commercial :</strong> Ozë Paris</p>
                  <p><strong>SIREN :</strong> 932 255 557</p>
                  <p><strong>Siège social :</strong> 61 Rue de Lyon, 75012 Paris, France</p>
                  <p><strong>Email :</strong> sav@ligne-blanche.fr</p>
                  <p><strong>Site web :</strong> www.ligne-blanche.fr</p>
                </div>
              </div>
            </div>

            {/* Directeur de publication */}
            <div className="font-sans mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900 flex items-center">
                <User className="h-6 w-6 text-yellow-500 mr-3" />
                Directeur de publication
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-3 text-gray-600">
                  <p><strong>Nom :</strong> Badis Benidir</p>
                  <p><strong>Qualité :</strong> Entrepreneur Individuel</p>
                </div>
              </div>
            </div>

            {/* Hébergement */}
            <div className="font-sans mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900 flex items-center">
                <Globe className="h-6 w-6 text-yellow-500 mr-3" />
                Hébergement du site
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-3 text-gray-600">
                  <p><strong>Hébergeur :</strong> Vercel Inc.</p>
                  <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
                  <p><strong>Site web :</strong> https://vercel.com</p>
                </div>
              </div>
            </div>

            {/* Propriété intellectuelle */}
            <div className="font-sans mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Propriété intellectuelle
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  L'ensemble de ce site relève de la législation française et internationale
                  sur le droit d'auteur et la propriété intellectuelle. Tous les droits de
                  reproduction sont réservés, y compris pour les documents téléchargeables
                  et les représentations iconographiques et photographiques.
                </p>
                <p>
                  La reproduction de tout ou partie de ce site sur un support électronique
                  quel qu'il soit est formellement interdite sauf autorisation expresse
                  du directeur de la publication.
                </p>
                <p>
                  Les marques et logos figurant sur le site sont des marques déposées.
                  Leur reproduction totale ou partielle à partir des éléments du site
                  sans l'autorisation expresse de l'exploitant du site est donc prohibée.
                </p>
              </div>
            </div>

            {/* Responsabilité */}
            <div className="font-sans mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Responsabilité
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Les informations contenues sur ce site sont aussi précises que possible
                  et le site est périodiquement remis à jour, mais peut toutefois contenir
                  des inexactitudes, des omissions ou des lacunes.
                </p>
                <p>
                  Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement,
                  merci de bien vouloir le signaler par email à l'adresse sav@ligne-blanche.fr,
                  en décrivant le problème de la manière la plus précise possible.
                </p>
                <p>
                  Tout contenu téléchargé se fait aux risques et périls de l'utilisateur
                  et sous sa seule responsabilité. En conséquence, Ozë Paris ne saurait
                  être tenu responsable d'un quelconque dommage subi par l'ordinateur
                  de l'utilisateur ou d'une quelconque perte de données consécutive au téléchargement.
                </p>
              </div>
            </div>

            {/* Liens hypertextes */}
            <div className="font-sans mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Liens hypertextes
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Les liens hypertextes mis en place dans le cadre du présent site web
                  en direction d'autres ressources présentes sur le réseau Internet
                  ne sauraient engager la responsabilité de Ozë Paris.
                </p>
                <p>
                  Ozë Paris ne peut être tenu responsable du contenu des sites
                  vers lesquels des liens sont établis.
                </p>
              </div>
            </div>

            {/* Cookies */}
            <div className="font-sans mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Cookies
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Le site peut-être amené à vous demander l'acceptation des cookies
                  pour des besoins de statistiques et d'affichage.
                  Un cookie ne nous permet pas de vous identifier ;
                  il sert uniquement à enregistrer des informations relatives
                  à la navigation de votre ordinateur sur notre site.
                </p>
                <p>
                  Vous pouvez à tout moment désactiver ces cookies et ce gratuitement
                  à partir des possibilités de désactivation qui vous sont offertes
                  et rappelées ci-après, sachant que cela peut réduire ou empêcher
                  l'accessibilité à tout ou partie des Services proposés par le site.
                </p>
              </div>
            </div>

            {/* Droit applicable */}
            <div className="font-sans mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900">
                Droit applicable
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-3 text-gray-600">
                  <p>
                    Tout litige en relation avec l'utilisation du site www.ligne-blanche.fr
                    est soumis au droit français. En dehors des cas où la loi ne le permet pas,
                    il est fait attribution exclusive de juridiction aux tribunaux compétents de Paris.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="font-sans mb-12">
              <h2 className="text-2xl font-medium mb-6 text-gray-900 flex items-center">
                <Mail className="h-6 w-6 text-yellow-500 mr-3" />
                Contact
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-4 text-gray-600">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Adresse</p>
                      <p>61 Rue de Lyon</p>
                      <p>75012 Paris, France</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p>sav@ligne-blanche.fr</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="font-sans text-center mt-16">
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
