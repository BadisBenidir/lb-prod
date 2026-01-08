import React from 'react';
import { CartItem } from '../../types';

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  subtotal,
  shippingCost,
  taxAmount,
  totalAmount
}) => {
  return (
    <div className="space-y-4">
      {/* Liste des articles avec style moderne */}
      <div className="space-y-3">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-contain rounded-lg bg-gray-100 flex-shrink-0"
              />
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-xs font-medium">
                1
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
              <p className="text-xs text-gray-600">{item.brand}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-sm text-gray-900">€{item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Séparateur avec style */}
      <div className="border-t border-gray-200 my-4"></div>
      
      {/* Détails du prix avec style amélioré */}
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-gray-600">Sous-total</span>
          <span className="font-medium text-gray-900">€{subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center">
            <span className="text-sm text-gray-600">Livraison</span>
            <div className="ml-2 group relative">
              <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Frais de port standard
              </div>
            </div>
          </div>
          <span className="font-medium text-gray-900">€{shippingCost.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-gray-600">TVA (20%)</span>
          <span className="font-medium text-gray-900">€{taxAmount.toFixed(2)}</span>
        </div>
        
        {/* Total avec style premium */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-black">€{totalAmount.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">TVA incluse</p>
        </div>
        
        {/* Info supplémentaire */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">Paiement sécurisé</p>
              <p className="text-xs text-blue-700 mt-1">Vos données sont protégées par cryptage SSL</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;