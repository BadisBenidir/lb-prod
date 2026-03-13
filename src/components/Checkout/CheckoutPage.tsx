import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Truck, Shield, Check } from 'lucide-react';
import { ShippingAddress } from '../../types';
import CheckoutSummary from './CheckoutSummary';
import ShippingForm, { DeliveryType, ShippingFormResult } from './ShippingForm';
import PaymentForm from './PaymentForm';
import OrderConfirmation from './OrderConfirmation';
import { useCheckout } from '../../hooks/useCheckout';
import { ProductUnavailableModal } from '../common';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { useCartContext } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { validateCoupon, AppliedCoupon } from '../../services/couponService';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { user, customer } = useProfile();
  const {
    cartItems,
    clearCart
  } = useCartContext();
  
  // État initial de l'adresse selon si l'utilisateur est connecté ou non
  const getInitialShippingAddress = (): ShippingAddress => {
    if (user && customer) {
      // Utilisateur connecté : pré-remplir avec les données de la BDD
      return {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: customer.phone || '',
        address: customer.address_line1 || '',
        city: customer.city || '',
        postalCode: customer.postal_code || '',
        country: customer.country || 'France'
      };
    } else {
      // Utilisateur non connecté : formulaire vide
      return {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'France'
      };
    }
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(getInitialShippingAddress());
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('point_relais');
  const { processStripeCheckout, isProcessing, error, availabilityResult } = useCheckout();

  // État pour le coupon
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  
  // Mettre à jour l'adresse si les données utilisateur changent
  useEffect(() => {
    setShippingAddress(getInitialShippingAddress());
  }, [user, customer]);
  
  const onBack = () => navigate('/boutique');
  const onOrderComplete = (orderId: string) => {
    navigate(`/checkout/success?session_id=${orderId}`);
  };
  const onClearCart = () => clearCart();
  
  // Protection si le panier est vide ou undefined (APRÈS tous les hooks)
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
          <p className="text-gray-600 mb-6">Ajoutez des produits à votre panier pour continuer.</p>
          <button
            onClick={() => navigate('/boutique')}
            className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors"
          >
            Continuer les achats
          </button>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // Frais de livraison Chronopost selon le type choisi
  // Point relais : 19,99€ | Adresse spécifique : 29,99€
  const shipping = deliveryType === 'point_relais' ? 9.99 : 1.00;
  // Calculer la réduction du coupon
  const discountAmount = appliedCoupon?.calculatedDiscount || 0;
  const total = subtotal - discountAmount + shipping;

  const steps = [
    { id: 1, title: 'Livraison', icon: Truck },
    { id: 2, title: 'Paiement', icon: CreditCard },
    { id: 3, title: 'Confirmation', icon: Check }
  ];

  const handleShippingSubmit = (result: ShippingFormResult) => {
    setShippingAddress(result.address);
    setDeliveryType(result.deliveryType);
    setCurrentStep(2);
  };

  // Gestion du coupon
  const handleApplyCoupon = async (code: string): Promise<{ success: boolean; error?: string }> => {
    setCouponError(null);
    setIsValidatingCoupon(true);

    try {
      // On utilise l'email du formulaire de livraison
      const email = shippingAddress.email;
      if (!email) {
        setCouponError('Veuillez d\'abord renseigner votre email dans le formulaire de livraison');
        return { success: false, error: 'Email requis' };
      }

      const result = await validateCoupon(code, email, subtotal);

      if (!result.isValid) {
        setCouponError(result.errorMessage || 'Code promo invalide');
        return { success: false, error: result.errorMessage };
      }

      // Coupon valide, on l'applique
      setAppliedCoupon({
        code: code.toUpperCase(),
        couponId: result.couponId!,
        discountType: result.discountType!,
        discountValue: result.discountValue!,
        calculatedDiscount: result.calculatedDiscount!
      });

      return { success: true };
    } catch (err) {
      const errorMessage = 'Erreur lors de la validation du code promo';
      setCouponError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const handlePaymentSubmit = async (payment: { type: string }) => {
    if (payment.type === 'stripe') {
      console.log('🚀 Démarrage du paiement Stripe...');

      // Préparer les données coupon si un coupon est appliqué
      const couponData = appliedCoupon ? {
        discountAmount: appliedCoupon.calculatedDiscount,
        couponCode: appliedCoupon.code,
        couponId: appliedCoupon.couponId
      } : undefined;

      // Traitement Stripe Checkout
      const result = await processStripeCheckout(
        cartItems,
        shippingAddress,
        user?.id,
        subtotal,
        shipping,
        total,
        couponData
      );
      
      if (result.success) {
        console.log('✅ Redirection vers Stripe réussie');
        // La redirection vers Stripe se fait automatiquement
        // Le retour se fera via les pages success/cancel
      } else {
        console.error('❌ Erreur Stripe:', result.error);
        // Si erreur de disponibilité, afficher la modal
        if (result.error?.includes('Produits plus disponibles') && availabilityResult) {
          setShowUnavailableModal(true);
        }
      }
    } else {
      // Ancien système (fallback)
      console.log('⚠️ Méthode de paiement non-Stripe détectée');
      const newOrderId = `LB-${Date.now()}`;
      setOrderId(newOrderId);
      setCurrentStep(3);
      onClearCart();
      onOrderComplete(newOrderId);
    }
  };

  // Gestionnaires pour la modal de produits indisponibles
  const handleContinueWithAvailable = () => {
    setShowUnavailableModal(false);
    // TODO: Mettre à jour le panier avec seulement les produits disponibles
    // et relancer le processus de checkout
    console.log('Continuer avec produits disponibles:', availabilityResult?.availableProducts);
  };

  const handleReturnToShopping = () => {
    setShowUnavailableModal(false);
    onBack(); // Retourner à la page précédente
  };

  if (cartItems.length === 0 && currentStep < 3) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light mb-4">Votre panier est vide</h2>
          <button
            onClick={onBack}
            className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors"
          >
            Retourner à la boutique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'}}>
      {/* Header avec breadcrumb moderne */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
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

      {/* Section titre moderne */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900" style={{fontSize: '2rem', fontWeight: '800'}}>
                🛒 Finaliser votre commande
              </h1>
              <div className="mt-2 flex items-center space-x-3">
                <p className="text-gray-600">Quelques étapes simples pour valider votre achat</p>
                {user && (
                  <div className="flex items-center bg-green-50 border border-green-200 rounded-lg px-3 py-1">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-green-800">
                      Connecté en tant que {user.firstName || user.email}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-2xl font-bold text-gray-900">€{total.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Progress Steps Moderne */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted ? 'bg-green-500 text-white shadow-lg' :
                      isActive ? 'bg-black text-white scale-110 shadow-lg' :
                      'bg-gray-100 text-gray-400 border-2 border-gray-300'
                    }`}>
                      {isCompleted ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className={`mt-3 text-sm font-medium transition-colors ${
                      isActive ? 'text-black' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-4 relative">
                      <div className="h-1 bg-gray-200 rounded-full">
                        <div className={`h-1 rounded-full transition-all duration-500 ${
                          currentStep > step.id ? 'bg-green-500 w-full' : 'bg-gray-200 w-0'
                        }`} />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-7">
            {currentStep === 1 && (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                            1
                          </div>
                          Adresse de livraison
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">Où souhaitez-vous recevoir votre commande ?</p>
                      </div>
                      {user && customer && (
                        <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                          <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 12a1 1 0 01-.707-.293L5.586 9l1.414-1.414L9 9.586l4.293-4.293L14.707 6.707 9.707 11.707A1 1 0 019 12z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium text-blue-800">
                            Informations pré-remplies
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <ShippingForm
                      initialData={shippingAddress}
                      isUserConnected={isAuthenticated}
                      onSubmit={handleShippingSubmit}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
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
                        onClick={() => setCurrentStep(1)}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Modifier l'adresse
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    {error && (
                      <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <h3 className="text-sm font-medium text-red-800">Erreur de paiement</h3>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <PaymentForm
                      shippingAddress={shippingAddress}
                      onSubmit={handlePaymentSubmit}
                      onBack={() => setCurrentStep(1)}
                      isProcessing={isProcessing}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="animate-in scale-in duration-300">
                <OrderConfirmation
                  orderId={orderId}
                  shippingAddress={shippingAddress}
                  cartItems={cartItems}
                  total={total}
                  onContinueShopping={onBack}
                />
              </div>
            )}
          </div>

          {/* Order Summary Sticky */}
          {currentStep < 3 && (
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
                    <CheckoutSummary
                      cartItems={cartItems}
                      subtotal={subtotal}
                      shipping={shipping}
                      tax={0}
                      total={total}
                      deliveryType={deliveryType}
                      appliedCoupon={appliedCoupon}
                      onApplyCoupon={handleApplyCoupon}
                      onRemoveCoupon={handleRemoveCoupon}
                      isValidatingCoupon={isValidatingCoupon}
                      couponError={couponError}
                      showCouponInput={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Badge Moderne */}
        {currentStep < 3 && (
          <div className="mt-12">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Shield className="h-6 w-6 text-blue-600 mr-3" />
                <span className="text-lg font-semibold text-blue-900">Paiement 100% sécurisé</span>
              </div>
              <p className="text-sm text-blue-700">
                Vos données sont protégées par un cryptage SSL 256-bit et notre partenaire de confiance Stripe
              </p>
              <div className="flex items-center justify-center mt-4 space-x-6 text-xs text-blue-600">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  SSL Sécurisé
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Données protégées
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Stripe Certifié
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal pour produits indisponibles */}
      {availabilityResult && (
        <ProductUnavailableModal
          isOpen={showUnavailableModal}
          onClose={() => setShowUnavailableModal(false)}
          availabilityResult={availabilityResult}
          onContinueWithAvailable={handleContinueWithAvailable}
          onReturnToShopping={handleReturnToShopping}
        />
      )}
    </div>
  );
};

export default CheckoutPage;