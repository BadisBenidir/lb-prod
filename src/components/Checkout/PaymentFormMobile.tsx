import React from 'react';
import { CreditCard, Lock, ArrowLeft, Shield, CheckCircle, User, MapPin, Edit3, Sparkles } from 'lucide-react';
import { ShippingAddress, PaymentMethod } from '../../types';

interface PaymentFormMobileProps {
  shippingAddress: ShippingAddress;
  onSubmit: (payment: PaymentMethod) => void;
  onBack: () => void;
  isProcessing: boolean;
}

const PaymentFormMobile: React.FC<PaymentFormMobileProps> = ({ 
  shippingAddress, 
  onSubmit, 
  onBack, 
  isProcessing 
}) => {

  return (
    <div className="space-y-6">
      {/* Shipping Address Summary - Mobile Optimized */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Adresse validée</h3>
          </div>
          <button
            onClick={onBack}
            className="flex items-center text-xs text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Edit3 className="h-3 w-3 mr-1" />
            Modifier
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-start">
            <User className="h-4 w-4 text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 text-sm">
                {shippingAddress.firstName} {shippingAddress.lastName}
              </p>
              <div className="flex items-start mt-2">
                <MapPin className="h-3 w-3 text-gray-500 mr-1 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-gray-600 leading-relaxed">
                  <p>{shippingAddress.address}</p>
                  <p>{shippingAddress.postalCode} {shippingAddress.city}</p>
                  <p className="font-medium text-gray-700 mt-1">{shippingAddress.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Section - Mobile First */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Paiement sécurisé</h2>
                <p className="text-white/80 text-xs">Propulsé par Stripe</p>
              </div>
            </div>
            <Sparkles className="h-6 w-6 text-white/60" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Trust Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 text-sm mb-2">
                  Protection maximale
                </h3>
                <p className="text-blue-700 text-xs leading-relaxed mb-3">
                  Vos données bancaires sont traitées par Stripe, leader mondial du paiement sécurisé. 
                  Aucune information n'est conservée sur nos serveurs.
                </p>
                
                {/* Payment Methods */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Visa', color: 'bg-blue-600' },
                    { name: 'MC', color: 'bg-red-500' },
                    { name: 'Amex', color: 'bg-green-600' },
                    { name: 'CB', color: 'bg-indigo-600' }
                  ].map((card) => (
                    <div key={card.name} className="flex items-center bg-white rounded-lg px-2 py-1 shadow-sm">
                      <div className={`w-2 h-2 rounded-full ${card.color} mr-2`}></div>
                      <span className="text-xs font-medium text-gray-700">{card.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Security Features - Mobile Grid */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            <div className="flex items-center bg-green-50 rounded-xl p-3 border border-green-200">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Lock className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-900">Chiffrement SSL 256-bit</p>
                <p className="text-xs text-green-700">Vos données sont cryptées</p>
              </div>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            
            <div className="flex items-center bg-green-50 rounded-xl p-3 border border-green-200">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Shield className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-900">3D Secure & PCI DSS</p>
                <p className="text-xs text-green-700">Authentification renforcée</p>
              </div>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>

          {/* Process Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-yellow-600 font-bold text-sm">ℹ️</span>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-900 text-sm mb-1">Étapes suivantes</h4>
                <div className="text-xs text-yellow-800 space-y-1">
                  <p>• Redirection sécurisée vers Stripe</p>
                  <p>• Saisie de vos données bancaires</p>
                  <p>• Confirmation de paiement instantanée</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => onSubmit({ type: 'stripe' })}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  <span>Redirection vers Stripe...</span>
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5 mr-3" />
                  <span>Payer maintenant</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={onBack}
              className="w-full flex items-center justify-center px-6 py-3 rounded-2xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'adresse
            </button>
          </div>

          {/* Trust Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-xs text-gray-600">
                Paiement 100% sécurisé par Stripe
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFormMobile;