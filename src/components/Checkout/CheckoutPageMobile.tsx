import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Truck, Check, Package, ChevronRight, ChevronDown, Loader2, AlertCircle, Ticket, X } from 'lucide-react';
import { ShippingAddress } from '../../types';
import CheckoutSummary from './CheckoutSummary';
import ShippingFormMobile from './ShippingFormMobile';
import { DeliveryType, ShippingFormResult } from './ShippingForm';
import PaymentFormMobile from './PaymentFormMobile';
import OrderConfirmation from './OrderConfirmation';
import { useCheckout } from '../../hooks/useCheckout';
import { ProductUnavailableModal } from '../common';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { useCartContext } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { validateCoupon, AppliedCoupon } from '../../services/couponService';

const CheckoutPageMobile: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { user, customer } = useProfile();
  const {
    cartItems,
    clearCart
  } = useCartContext();
  
  const getInitialShippingAddress = (): ShippingAddress => {
    if (user && customer) {
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
  const [showCouponField, setShowCouponField] = useState(false);
  const [mobileCouponCode, setMobileCouponCode] = useState('');
  
  useEffect(() => {
    setShippingAddress(getInitialShippingAddress());
  }, [user, customer]);
  
  const onBack = () => navigate('/boutique');
  const onOrderComplete = (orderId: string) => {
    navigate(`/checkout/success?session_id=${orderId}`);
  };
  const onClearCart = () => clearCart();
  
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold mb-3">Panier vide</h2>
          <p className="text-gray-600 text-sm mb-6">Ajoutez des produits à votre panier pour continuer.</p>
          <button
            onClick={() => navigate('/boutique')}
            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Découvrir la boutique
          </button>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // Frais de livraison Chronopost selon le type choisi
  // Point relais : 19,99€ | Adresse spécifique : 29,99€
  const shipping = deliveryType === 'point_relais' ? 19.99 : 29.99;
  // Calculer la réduction du coupon
  const discountAmount = appliedCoupon?.calculatedDiscount || 0;
  const total = subtotal - discountAmount + shipping;

  const steps = [
    { id: 1, title: 'Livraison', icon: Truck, desc: 'Adresse de livraison' },
    { id: 2, title: 'Paiement', icon: CreditCard, desc: 'Méthode de paiement' },
    { id: 3, title: 'Confirmation', icon: Check, desc: 'Commande validée' }
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

  // Variante compacte utilisée par l'accordéon "Ajouter un code promo" de
  // l'étape 1 (livraison) : réinitialise le champ local en cas de succès.
  const handleApplyMobileCoupon = async () => {
    if (!mobileCouponCode.trim()) return;
    const result = await handleApplyCoupon(mobileCouponCode.trim());
    if (result.success) {
      setMobileCouponCode('');
      setShowCouponField(false);
    }
  };

  const handlePaymentSubmit = async (payment: { type: string }) => {
    if (payment.type === 'stripe') {
      // Préparer les données coupon si un coupon est appliqué
      const couponData = appliedCoupon ? {
        discountAmount: appliedCoupon.calculatedDiscount,
        couponCode: appliedCoupon.code,
        couponId: appliedCoupon.couponId
      } : undefined;

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
        // Redirection automatique vers Stripe
      } else {
        if (result.error?.includes('Produits plus disponibles') && availabilityResult) {
          setShowUnavailableModal(true);
        }
      }
    } else {
      const newOrderId = `LB-${Date.now()}`;
      setOrderId(newOrderId);
      setCurrentStep(3);
      onClearCart();
      onOrderComplete(newOrderId);
    }
  };

  const handleContinueWithAvailable = () => {
    setShowUnavailableModal(false);
    console.log('Continuer avec produits disponibles:', availabilityResult?.availableProducts);
  };

  const handleReturnToShopping = () => {
    setShowUnavailableModal(false);
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Mobile Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Retour</span>
            </button>
            <div className="text-right">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-lg font-bold text-gray-900">€{total.toFixed(2)}</p>
            </div>
          </div>

          {/* Mobile Progress */}
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isActive ? 'bg-black text-white' :
                      'bg-gray-200 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${
                      isActive ? 'text-black' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-2">
                      <div className="h-0.5 bg-gray-200">
                        <div className={`h-0.5 transition-all duration-300 ${
                          currentStep > step.id ? 'bg-green-500 w-full' : 'bg-gray-200 w-0'
                        }`} />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Current Step Title */}
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-900">
              {steps[currentStep - 1]?.desc}
            </h1>
            {user && currentStep === 1 && (
              <p className="text-xs text-green-600 mt-1">
                ✓ Informations pré-remplies
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Step 1: Shipping */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center mr-3">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Livraison</h2>
                  <p className="text-xs text-gray-600">Où recevoir votre commande ?</p>
                </div>
              </div>
              <ShippingFormMobile
                initialData={shippingAddress}
                isUserConnected={isAuthenticated}
                onSubmit={handleShippingSubmit}
              />
            </div>

            {/* Mobile Cart Summary Preview */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Votre commande</h3>
                <span className="text-sm text-gray-500">
                  {cartItems.length} article{cartItems.length > 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="space-y-3">
                {cartItems.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-600">{item.brand}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">Qté: {item.quantity}</p>
                    </div>
                  </div>
                ))}
                
                {cartItems.length > 2 && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      +{cartItems.length - 2} autre{cartItems.length - 2 > 1 ? 's' : ''} article{cartItems.length - 2 > 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>

              {/* Code promo — accordéon compact pour ne pas surcharger l'écran mobile */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {appliedCoupon ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                      <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                      <span className="text-sm text-green-800 truncate">
                        Code <code className="font-mono font-medium">{appliedCoupon.code}</code> appliqué
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors flex-shrink-0"
                      title="Supprimer le code promo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowCouponField((v) => !v)}
                      className="flex items-center justify-between w-full text-sm font-medium text-gray-700"
                    >
                      <span className="flex items-center">
                        <Ticket className="h-4 w-4 mr-2 text-gray-400" />
                        Ajouter un code promo
                      </span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showCouponField ? 'rotate-180' : ''}`} />
                    </button>
                    {showCouponField && (
                      <div className="mt-3">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              value={mobileCouponCode}
                              onChange={(e) => setMobileCouponCode(e.target.value.toUpperCase())}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyMobileCoupon())}
                              placeholder="BIENVENUE"
                              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm uppercase font-mono focus:ring-2 focus:ring-black focus:border-transparent"
                              disabled={isValidatingCoupon}
                            />
                          </div>
                          <button
                            onClick={handleApplyMobileCoupon}
                            disabled={!mobileCouponCode.trim() || isValidatingCoupon}
                            className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                          >
                            {isValidatingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : 'OK'}
                          </button>
                        </div>
                        {couponError && (
                          <div className="mt-2 flex items-center text-red-600 text-xs">
                            <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span>{couponError}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">€{subtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Réduction ({appliedCoupon.code})</span>
                    <span className="font-medium">-€{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium">€{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-lg text-gray-900">€{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center mr-3">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Paiement</h2>
                    <p className="text-xs text-gray-600">Méthode de paiement</p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-gray-600 hover:text-gray-900 flex items-center"
                >
                  Modifier
                  <ChevronRight className="h-3 w-3 ml-1 rotate-180" />
                </button>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Erreur de paiement</p>
                      <p className="text-xs text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <PaymentFormMobile
                shippingAddress={shippingAddress}
                onSubmit={handlePaymentSubmit}
                onBack={() => setCurrentStep(1)}
                isProcessing={isProcessing}
              />
            </div>


            {/* Mobile Order Summary */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Récapitulatif</h3>
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
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <OrderConfirmation
            orderId={orderId}
            shippingAddress={shippingAddress}
            cartItems={cartItems}
            total={total}
            onContinueShopping={onBack}
          />
        )}

        {/* Loading Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 text-center max-w-xs mx-4">
              <Loader2 className="h-8 w-8 animate-spin text-gray-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Traitement en cours</h3>
              <p className="text-sm text-gray-600">
                Redirection vers le paiement sécurisé...
              </p>
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

export default CheckoutPageMobile;