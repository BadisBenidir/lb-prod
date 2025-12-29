import React from 'react';
import { CheckCircle, Package, Truck, Mail } from 'lucide-react';
import { CartItem, ShippingAddress } from '../../types';

interface OrderConfirmationProps {
  orderId: string;
  shippingAddress: ShippingAddress;
  cartItems: CartItem[];
  total: number;
  onContinueShopping: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderId,
  shippingAddress,
  cartItems,
  total,
  onContinueShopping
}) => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Success Icon */}
      <div className="mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-light text-gray-900 mb-2">
          Commande confirmée !
        </h1>
        <p className="text-gray-600">
          Merci pour votre achat. Votre commande a été traitée avec succès.
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-white border border-gray-200 p-6 mb-8 text-left">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Détails de la commande</h2>
          <span className="text-sm text-gray-600">#{orderId}</span>
        </div>

        {/* Items */}
        <div className="space-y-4 mb-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover bg-gray-100"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.brand}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-600">Quantité: {item.quantity}</span>
                  <span className="font-semibold">€{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total payé</span>
            <span>€{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white border border-gray-200 p-6 mb-8 text-left">
        <h3 className="text-lg font-semibold mb-4">Adresse de livraison</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p className="font-medium text-black">
            {shippingAddress.firstName} {shippingAddress.lastName}
          </p>
          {shippingAddress.company && <p>{shippingAddress.company}</p>}
          <p>{shippingAddress.address}</p>
          <p>{shippingAddress.postalCode} {shippingAddress.city}</p>
          <p>{shippingAddress.country}</p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Prochaines étapes</h3>
        <div className="space-y-4 text-left">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">Confirmation par email</p>
              <p className="text-sm text-gray-600">
                Un email de confirmation a été envoyé à {shippingAddress.email}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">Préparation de la commande</p>
              <p className="text-sm text-gray-600">
                Votre commande sera préparée dans les 24-48h ouvrées
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">Expédition</p>
              <p className="text-sm text-gray-600">
                Livraison estimée sous 3-5 jours ouvrés
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <button
          onClick={onContinueShopping}
          className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors"
        >
          Continuer mes achats
        </button>
        
        <p className="text-sm text-gray-600">
          Vous pouvez suivre votre commande dans votre{' '}
          <a href="#" className="text-black hover:underline">espace client</a>
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;