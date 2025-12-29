import React from 'react';
import { X } from 'lucide-react';
import Portal from './Portal';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Politique de Confidentialité</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-4">1. Collecte des informations</h3>
              <p className="mb-6 text-gray-700">
                Nous collectons des informations lorsque vous vous inscrivez sur notre site, passez une commande ou remplissez un formulaire. Les informations collectées incluent votre nom, votre adresse e-mail, votre numéro de téléphone et votre adresse.
              </p>

              <h3 className="text-lg font-semibold mb-4">2. Utilisation des informations</h3>
              <p className="mb-6 text-gray-700">
                Les informations que nous collectons peuvent être utilisées pour :
              </p>
              <ul className="mb-6 text-gray-700 list-disc pl-6">
                <li>Personnaliser votre expérience et répondre à vos besoins individuels</li>
                <li>Traiter vos commandes et transactions</li>
                <li>Vous envoyer des e-mails périodiques concernant votre commande ou d'autres produits et services</li>
                <li>Améliorer notre site web et nos services</li>
                <li>Améliorer le service client et vos besoins de soutien</li>
              </ul>

              <h3 className="text-lg font-semibold mb-4">3. Confidentialité du commerce en ligne</h3>
              <p className="mb-6 text-gray-700">
                Nous sommes les seuls propriétaires des informations collectées sur ce site. Vos informations personnelles ne seront pas vendues, échangées, transférées ou données à une autre société pour n'importe quelle raison, sans votre consentement, en dehors de ce qui est nécessaire pour répondre à une demande ou transaction.
              </p>

              <h3 className="text-lg font-semibold mb-4">4. Divulgation à des tiers</h3>
              <p className="mb-6 text-gray-700">
                Nous ne vendons, n'échangeons et ne transférons pas vos informations personnelles identifiables à des tiers. Cela ne comprend pas les tierce parties de confiance qui nous aident à exploiter notre site Web ou à mener nos affaires, tant que ces parties conviennent de garder ces informations confidentielles.
              </p>

              <h3 className="text-lg font-semibold mb-4">5. Protection des informations</h3>
              <p className="mb-6 text-gray-700">
                Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. Nous utilisons un cryptage à la pointe de la technologie pour protéger les informations sensibles transmises en ligne.
              </p>

              <h3 className="text-lg font-semibold mb-4">6. Cookies</h3>
              <p className="mb-6 text-gray-700">
                Nous utilisons des cookies pour améliorer votre expérience. Les cookies sont de petits fichiers qu'un site ou son fournisseur de services transfère sur le disque dur de votre ordinateur par l'intermédiaire de votre navigateur Web (si vous l'acceptez).
              </p>

              <h3 className="text-lg font-semibold mb-4">7. Se désabonner</h3>
              <p className="mb-6 text-gray-700">
                Nous utilisons l'adresse e-mail que vous fournissez pour vous envoyer des informations et des mises à jour relatives à votre commande, des nouvelles occasionnelles de la société, des informations sur des produits connexes, etc. Si à n'importe quel moment vous souhaitez vous désinscrire et ne plus recevoir d'e-mails, des instructions détaillées de désabonnement sont incluses en bas de chaque e-mail.
              </p>

              <h3 className="text-lg font-semibold mb-4">8. Consentement</h3>
              <p className="mb-6 text-gray-700">
                En utilisant notre site, vous consentez à notre politique de confidentialité. Si nous décidons de modifier notre politique de confidentialité, nous publierons ces changements sur cette page.
              </p>

              <h3 className="text-lg font-semibold mb-4">9. Accès et rectification</h3>
              <p className="mb-6 text-gray-700">
                Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression des données personnelles vous concernant.
              </p>

              <h3 className="text-lg font-semibold mb-4">10. Durée de conservation</h3>
              <p className="mb-6 text-gray-700">
                Vos données personnelles sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles sont collectées et traitées. Les données de compte client sont conservées pendant toute la durée de la relation commerciale.
              </p>

              <h3 className="text-lg font-semibold mb-4">11. Responsable du traitement</h3>
              <p className="mb-6 text-gray-700">
                Le responsable du traitement de vos données personnelles est Ligne Blanche. Pour toute question relative à cette politique de confidentialité ou pour exercer vos droits, vous pouvez nous contacter via notre formulaire de contact.
              </p>

              <h3 className="text-lg font-semibold mb-4">12. Modification de la politique</h3>
              <p className="text-gray-700">
                Cette politique de confidentialité peut être modifiée à tout moment. La version en vigueur est celle publiée sur notre site web. Nous vous encourageons à consulter régulièrement cette page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default PrivacyModal;