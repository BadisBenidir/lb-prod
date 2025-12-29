import React from 'react';
import { CreditCard, Lock, ArrowLeft } from 'lucide-react';
import { ShippingAddress, PaymentMethod } from '../../types';

interface PaymentFormProps {
  shippingAddress: ShippingAddress;
  onSubmit: (payment: PaymentMethod) => void;
  onBack: () => void;
  isProcessing: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  shippingAddress, 
  onSubmit, 
  onBack, 
  isProcessing 
}) => {

  return (
    <div className="space-y-6">
      {/* Shipping Address Summary */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Adresse de livraison</h3>
          <button
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-black transition-colors"
          >
            Modifier
          </button>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p className="font-medium text-black">
            {shippingAddress.firstName} {shippingAddress.lastName}
          </p>
          <p>{shippingAddress.address}</p>
          <p>{shippingAddress.postalCode} {shippingAddress.city}</p>
          <p>{shippingAddress.country}</p>
          <p>{shippingAddress.email}</p>
          <p>{shippingAddress.phone}</p>
        </div>
      </div>

      {/* Payment Method - Stripe Checkout */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <CreditCard className="h-6 w-6 mr-3 text-gray-700" />
            Paiement sécurisé
          </h2>
          
          {/* Stripe Info Card */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Paiement par carte bancaire
                </h3>
                <p className="text-blue-700 text-sm mb-3">
                  Votre paiement sera traité de manière sécurisée par Stripe, leader mondial du paiement en ligne.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white text-blue-700 border border-blue-200">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Visa
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white text-blue-700 border border-blue-200">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Mastercard
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white text-blue-700 border border-blue-200">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    American Express
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white text-blue-700 border border-blue-200">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    CB
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium text-green-900">Chiffrement SSL</p>
                <p className="text-xs text-green-700">Données protégées</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium text-green-900">3D Secure</p>
                <p className="text-xs text-green-700">Authentification renforcée</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium text-green-900">Aucune donnée stockée</p>
                <p className="text-xs text-green-700">Sécurité maximale</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 flex items-center justify-center px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </button>
            
            <button
              onClick={() => onSubmit({ type: 'stripe' })}
              disabled={isProcessing}
              className="flex-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-4 px-8 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Redirection vers Stripe...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5 mr-3" />
                  Procéder au paiement sécurisé
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;