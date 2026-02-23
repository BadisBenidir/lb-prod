import React from 'react';
import { X } from 'lucide-react';
import Portal from './Portal';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Conditions Générales</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-4">1. Objet</h3>
              <p className="mb-6 text-gray-700">
                Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre Ozë Paris et ses clients dans le cadre de la vente en ligne de produits de maroquinerie et prêt-à-porter de luxe de seconde main.
              </p>

              <h3 className="text-lg font-semibold mb-4">2. Acceptation des conditions</h3>
              <p className="mb-6 text-gray-700">
                Toute commande passée sur notre site implique l'acceptation pleine et entière des présentes conditions générales de vente. Ces conditions sont accessibles à tout moment sur notre site et prévaudront sur toute autre condition figurant dans tout autre document.
              </p>

              <h3 className="text-lg font-semibold mb-4">3. Produits</h3>
              <p className="mb-6 text-gray-700">
                Tous les produits proposés sont des articles de seconde main authentifiés par notre expertise familiale. Chaque produit est décrit avec précision, incluant son état, sa composition et ses caractéristiques. Les photos présentées sont contractuelles.
              </p>

              <h3 className="text-lg font-semibold mb-4">4. Prix</h3>
              <p className="mb-6 text-gray-700">
                Les prix sont indiqués en euros toutes taxes comprises. Ils incluent la TVA applicable au jour de la commande. Les frais de livraison sont indiqués avant la validation de la commande.
              </p>

              <h3 className="text-lg font-semibold mb-4">5. Commande</h3>
              <p className="mb-6 text-gray-700">
                La commande est définitive après validation du paiement. Nous nous réservons le droit d'annuler toute commande d'un client avec lequel il existerait un litige relatif au paiement d'une commande antérieure.
              </p>

              <h3 className="text-lg font-semibold mb-4">6. Paiement</h3>
              <p className="mb-6 text-gray-700">
                Le paiement s'effectue par carte bancaire via notre plateforme sécurisée Stripe. Le débit de votre compte s'effectue au moment de la validation de votre commande.
              </p>

              <h3 className="text-lg font-semibold mb-4">7. Livraison</h3>
              <p className="mb-6 text-gray-700">
                Les délais de livraison sont communiqués à titre indicatif. Nous mettons tout en œuvre pour respecter ces délais. La livraison s'effectue à l'adresse indiquée lors de la commande.
              </p>

              <h3 className="text-lg font-semibold mb-4">8. Droit de rétractation</h3>
              <p className="mb-6 text-gray-700">
                Conformément à la législation en vigueur, vous disposez d'un délai de 14 jours francs pour exercer votre droit de rétractation sans avoir à justifier de motifs ni à payer de pénalités.
              </p>

              <h3 className="text-lg font-semibold mb-4">9. Garanties</h3>
              <p className="mb-6 text-gray-700">
                Tous nos produits bénéficient de la garantie légale de conformité et de la garantie contre les vices cachés. Nous garantissons l'authenticité de tous les articles proposés.
              </p>

              <h3 className="text-lg font-semibold mb-4">10. Responsabilité</h3>
              <p className="mb-6 text-gray-700">
                Notre responsabilité ne saurait être engagée pour tous les inconvénients ou dommages inhérents à l'utilisation du réseau Internet, notamment une rupture de service, une intrusion extérieure ou la présence de virus informatiques.
              </p>

              <h3 className="text-lg font-semibold mb-4">11. Propriété intellectuelle</h3>
              <p className="mb-6 text-gray-700">
                Tous les éléments du site (textes, photos, logos) sont protégés par le droit d'auteur et sont la propriété exclusive de Ozë Paris. Toute reproduction est interdite sans autorisation préalable.
              </p>

              <h3 className="text-lg font-semibold mb-4">12. Données personnelles</h3>
              <p className="mb-6 text-gray-700">
                Les données personnelles collectées sont nécessaires au traitement de votre commande. Elles sont traitées conformément à notre politique de confidentialité et ne sont jamais communiquées à des tiers.
              </p>

              <h3 className="text-lg font-semibold mb-4">13. Litiges</h3>
              <p className="mb-6 text-gray-700">
                En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux français seront seuls compétents.
              </p>

              <h3 className="text-lg font-semibold mb-4">14. Modification des CGV</h3>
              <p className="mb-6 text-gray-700">
                Nous nous réservons le droit de modifier les présentes conditions générales de vente à tout moment. Les conditions applicables sont celles en vigueur à la date de la commande.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default TermsModal;