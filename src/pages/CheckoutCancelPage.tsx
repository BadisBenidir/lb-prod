import React from 'react';
import { X, ArrowLeft, CreditCard, Shield, Clock } from 'lucide-react';
import { VoidApiResponse } from 'karrio';

interface CheckoutCancelPageProps {
  onReturnToCart: () => void;
  onContinueShopping: () => void;
}

const CheckoutCancelPage: React.FC<CheckoutCancelPageProps> = ({ 
  onReturnToCart, 
  onContinueShopping 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Icône d'annulation */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
            <X className="h-12 w-12 text-red-600" />
          </div>
        </div>

        {/* Card principale */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Paiement Annulé
            </h1>
            <p className="text-gray-600 mb-8">
              Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
            </p>

            {/* Rassurance */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Vos données sont protégées
              </h3>
              <p className="text-sm text-blue-700">
                Aucune information bancaire n'a été conservée. Votre sécurité est notre priorité.
              </p>
            </div>

            {/* Options */}
            <div className="space-y-4 mb-6">
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-3">Que souhaitez-vous faire ?</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <CreditCard className="h-5 w-5 text-gray-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Réessayer le paiement</p>
                      <p className="text-xs text-gray-600">Vos articles sont toujours dans votre panier</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-5 w-5 text-gray-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Continuer mes achats</p>
                      <p className="text-xs text-gray-600">Votre panier est sauvegardé</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={onReturnToCart}
                className="w-full bg-black text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span>Retourner au panier</span>
              </button>
              
              <button
                onClick={onContinueShopping}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Continuer mes achats
              </button>
            </div>
          </div>

          {/* Footer de la card */}
          <div className="bg-gray-50 px-8 py-4">
            <div className="flex items-center justify-center text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Paiement sécurisé par Stripe
              </div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Besoin d'aide ? Contactez-nous à{' '}
            <a href="mailto:sav@ligne-blanche.fr" className="text-blue-600 hover:underline">
              sav@ligne-blanche.fr
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCancelPage;