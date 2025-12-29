import React, { useState } from 'react';
import { ShippingAddress, PaymentMethod } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import AddressForm from './AddressForm';
import OrderSummary from './OrderSummary';
import PaymentForm from './PaymentForm';

interface CheckoutProps {
  cartItems: any[];
  subtotal: number;
  onCheckoutComplete: (orderData: any) => void;
  onBackToCart: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ 
  cartItems, 
  subtotal, 
  onCheckoutComplete,
  onBackToCart
}) => {
  const { customer } = useAuth();
  const [currentStep, setCurrentStep] = useState<'address' | 'payment' | 'review'>('address');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: customer?.first_name || '',
    lastName: customer?.last_name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address_line1 || '',
    city: customer?.city || '',
    postalCode: customer?.postal_code || '',
    country: customer?.country || 'France'
  });
  const [billingAddress, setBillingAddress] = useState<ShippingAddress>({
    firstName: customer?.first_name || '',
    lastName: customer?.last_name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address_line1 || '',
    city: customer?.city || '',
    postalCode: customer?.postal_code || '',
    country: customer?.country || 'France'
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'card'
  });
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingCost = 39.99; // Frais de livraison Chronopost (toujours payant)
  const taxAmount = subtotal * 0.2; // TVA 20%
  const totalAmount = subtotal + shippingCost + taxAmount;

  const handleAddressSubmit = (address: ShippingAddress, isBilling: boolean = false) => {
    if (isBilling) {
      setBillingAddress(address);
    } else {
      setShippingAddress(address);
      if (sameAsShipping) {
        setBillingAddress(address);
      }
    }
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = (payment: PaymentMethod) => {
    setPaymentMethod(payment);
    setCurrentStep('review');
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      // Simuler l'appel API pour créer la commande
      const orderData = {
        cartItems,
        shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        paymentMethod,
        subtotal,
        shippingCost,
        taxAmount,
        totalAmount
      };
      
      // Appeler la fonction de callback pour finaliser la commande
      await onCheckoutComplete(orderData);
      
      // La redirection est gérée par onCheckoutComplete dans App.tsx
    } catch (error) {
      console.error('Erreur lors de la validation de la commande:', error);
      // Afficher un message d'erreur
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSameAsShippingChange = (checked: boolean) => {
    setSameAsShipping(checked);
    if (checked) {
      setBillingAddress(shippingAddress);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'}}>
      {/* Header avec breadcrumb */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={onBackToCart}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Retour au panier</span>
            </button>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Panier</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-900 font-medium">Commande</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar moderne */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900" style={{fontSize: '2rem', fontWeight: '800'}}>🛒 Finaliser votre commande</h1>
            <div className="text-sm text-gray-500">
              {cartItems.length} article{cartItems.length > 1 ? 's' : ''}
            </div>
          </div>
          
          {/* Progress steps */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300 ${
                currentStep === 'address' 
                  ? 'bg-black text-white scale-110' 
                  : currentStep === 'payment' || currentStep === 'review'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep === 'payment' || currentStep === 'review' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : '1'}
              </div>
              <span className={`ml-3 text-sm font-medium transition-colors ${
                currentStep === 'address' ? 'text-black' : 'text-gray-500'
              }`}>
                Livraison
              </span>
            </div>
            
            <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${
              currentStep === 'payment' || currentStep === 'review' ? 'bg-green-500' : 'bg-gray-200'
            }`}></div>
            
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300 ${
                currentStep === 'payment'
                  ? 'bg-black text-white scale-110'
                  : currentStep === 'review'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep === 'review' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : '2'}
              </div>
              <span className={`ml-3 text-sm font-medium transition-colors ${
                currentStep === 'payment' ? 'text-black' : 'text-gray-500'
              }`}>
                Paiement
              </span>
            </div>
            
            <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${
              currentStep === 'review' ? 'bg-green-500' : 'bg-gray-200'
            }`}></div>
            
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300 ${
                currentStep === 'review' ? 'bg-black text-white scale-110' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <span className={`ml-3 text-sm font-medium transition-colors ${
                currentStep === 'review' ? 'text-black' : 'text-gray-500'
              }`}>
                Confirmation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Colonne principale - Formulaires */}
          <div className="lg:col-span-7">

            {/* Contenu selon l'étape avec animations */}
            <div className="space-y-6">
              {currentStep === 'address' && (
                <div className="animate-in slide-in-from-right-4 duration-300">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                          1
                        </div>
                        Adresse de livraison
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">Où souhaitez-vous recevoir votre commande ?</p>
                    </div>
                    <div className="p-6">
                      <AddressForm
                        shippingAddress={shippingAddress}
                        billingAddress={billingAddress}
                        sameAsShipping={sameAsShipping}
                        onSameAsShippingChange={handleSameAsShippingChange}
                        onSubmit={handleAddressSubmit}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'payment' && (
                <div className="animate-in slide-in-from-right-4 duration-300">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                              2
                            </div>
                            Paiement
                          </h2>
                          <p className="mt-1 text-sm text-gray-600">Choisissez votre méthode de paiement</p>
                        </div>
                        <button
                          onClick={() => setCurrentStep('address')}
                          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          Modifier l'adresse
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <PaymentForm
                        paymentMethod={paymentMethod}
                        onSubmit={handlePaymentSubmit}
                        onBack={() => setCurrentStep('address')}
                        orderData={{
                          cartItems,
                          shippingAddress,
                          billingAddress: sameAsShipping ? shippingAddress : billingAddress,
                          paymentMethod,
                          subtotal,
                          shippingCost,
                          taxAmount,
                          totalAmount
                        }}
                        userId={customer?.id || ''}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'review' && (
                <div className="animate-in slide-in-from-right-4 duration-300 space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                          3
                        </div>
                        Confirmation de commande
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">Vérifiez vos informations avant de finaliser</p>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      {/* Adresse de livraison - Card moderne */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">Livraison</h3>
                              <p className="text-sm text-gray-600">Estimée sous 3-5 jours</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setCurrentStep('address')}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                          >
                            Modifier
                          </button>
                        </div>
                        <div className="ml-13">
                          <p className="font-medium text-gray-900">{shippingAddress.firstName} {shippingAddress.lastName}</p>
                          <p className="text-gray-700">{shippingAddress.address}</p>
                          {shippingAddress.addressLine2 && <p className="text-gray-700">{shippingAddress.addressLine2}</p>}
                          <p className="text-gray-700">{shippingAddress.postalCode} {shippingAddress.city}</p>
                          <p className="text-gray-700">{shippingAddress.country}</p>
                          <p className="text-gray-700 mt-2">{shippingAddress.phone}</p>
                        </div>
                      </div>

                      {/* Méthode de paiement - Card moderne */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">Paiement</h3>
                              <p className="text-sm text-gray-600">Sécurisé par Stripe</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setCurrentStep('payment')}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                          >
                            Modifier
                          </button>
                        </div>
                        <div className="ml-13">
                          <p className="text-gray-700 font-medium">
                            {paymentMethod.type === 'card' ? 'Carte bancaire' : 
                             paymentMethod.type === 'paypal' ? 'PayPal' : 
                             'Virement bancaire'}
                          </p>
                        </div>
                      </div>

                      {/* Bouton de validation moderne */}
                      <div className="pt-6 border-t border-gray-100">
                        <button
                          onClick={handlePlaceOrder}
                          disabled={isSubmitting}
                          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                            isSubmitting
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-black hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-0.5'
                          }`}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                              Validation en cours...
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Finaliser la commande • {totalAmount.toFixed(2)}€
                            </div>
                          )}
                        </button>
                        <p className="text-xs text-gray-500 text-center mt-3">
                          En validant, vous acceptez nos conditions de vente
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Colonne de droite - Résumé de la commande sticky */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Récapitulatif
                  </h3>
                </div>
                <div className="p-6">
                  <OrderSummary
                    cartItems={cartItems}
                    subtotal={subtotal}
                    shippingCost={shippingCost}
                    taxAmount={taxAmount}
                    totalAmount={totalAmount}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;