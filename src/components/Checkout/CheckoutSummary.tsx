import React, { useState } from 'react';
import { CartItem } from '../../types';
import { DeliveryType } from './ShippingForm';
import { AppliedCoupon } from '../../services/couponService';
import { Ticket, X, Loader2, Check, AlertCircle } from 'lucide-react';

interface CheckoutSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  deliveryType?: DeliveryType;
  // Props pour le coupon
  appliedCoupon?: AppliedCoupon | null;
  onApplyCoupon?: (code: string) => Promise<{ success: boolean; error?: string }>;
  onRemoveCoupon?: () => void;
  isValidatingCoupon?: boolean;
  couponError?: string | null;
  showCouponInput?: boolean;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  cartItems,
  subtotal,
  shipping,
  tax,
  total,
  deliveryType = 'point_relais',
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  isValidatingCoupon = false,
  couponError,
  showCouponInput = true
}) => {
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = async () => {
    if (onApplyCoupon && couponCode.trim()) {
      const result = await onApplyCoupon(couponCode.trim());
      if (result.success) {
        setCouponCode('');
      }
    }
  };

  const handleRemoveCoupon = () => {
    if (onRemoveCoupon) {
      onRemoveCoupon();
      setCouponCode('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApplyCoupon();
    }
  };
  return (
    <div className="bg-white border border-gray-200 p-6 sticky top-8">
      <h3 className="text-lg font-semibold mb-6">Récapitulatif</h3>
      
      {/* Items */}
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-contain bg-gray-100"
            />
            <div className="flex-1">
              <h4 className="font-medium text-sm">{item.name}</h4>
              <p className="text-sm text-gray-600">{item.brand}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-600">Qté: {item.quantity}</span>
                <span className="font-semibold">€{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Code Promo */}
      {showCouponInput && onApplyCoupon && (
        <div className="border-t border-gray-200 pt-4 mb-4">
          {!appliedCoupon ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code promo
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyPress={handleKeyPress}
                    placeholder="BIENVENUE"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm uppercase font-mono focus:ring-2 focus:ring-black focus:border-transparent"
                    disabled={isValidatingCoupon}
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  disabled={!couponCode.trim() || isValidatingCoupon}
                  className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                >
                  {isValidatingCoupon ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'OK'
                  )}
                </button>
              </div>
              {couponError && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>{couponError}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <div>
                    <span className="text-sm font-medium text-green-800">
                      Code appliqué :
                    </span>
                    <code className="ml-1 bg-green-100 px-1.5 py-0.5 rounded text-green-900 font-mono text-sm">
                      {appliedCoupon.code}
                    </code>
                  </div>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
                  title="Supprimer le code promo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-green-700 mt-1">
                {appliedCoupon.discountType === 'percentage'
                  ? `${appliedCoupon.discountValue}% de réduction`
                  : `${appliedCoupon.discountValue}€ de réduction`
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between">
          <span>Sous-total</span>
          <span>€{subtotal.toLocaleString()}</span>
        </div>

        {/* Affichage de la réduction si coupon appliqué */}
        {appliedCoupon && appliedCoupon.calculatedDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center">
              <Ticket className="h-4 w-4 mr-1" />
              Réduction ({appliedCoupon.code})
            </span>
            <span>-€{appliedCoupon.calculatedDiscount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>
            Livraison Chronopost
            <span className="block text-xs text-gray-500">
              {deliveryType === 'point_relais' ? 'Point Relais' : 'À une adresse'}
            </span>
          </span>
          <span>{shipping === 0 ? 'Gratuite' : `€${shipping.toFixed(2)}`}</span>
        </div>

        {tax > 0 && (
          <div className="flex justify-between">
            <span>TVA (20%)</span>
            <span>€{tax.toFixed(2)}</span>
          </div>
        )}

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <div className="text-sm text-blue-700">
          <p className="font-medium mb-1">📦 Livraison Chronopost</p>
          <p>• Remise contre signature obligatoire</p>
          <p>• Suivi temps réel inclus</p>
          <p>• Livraison en 24-48h</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;