import React from 'react';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { CartItem } from '../../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  totalPrice: number;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  totalPrice,
  onCheckout
}) => {
  // Fermer le panier avec la touche Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Empêcher le scroll du body quand le panier est ouvert
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm md:max-w-md bg-white z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b">
            <h2 className="text-lg md:text-xl font-semibold">Panier</h2>
            <button onClick={onClose} className="hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4 text-sm md:text-base">Votre panier est vide</p>
                <button 
                  onClick={onClose}
                  className="bg-black text-white px-4 md:px-6 py-2 font-medium hover:bg-gray-800 transition-colors text-sm md:text-base"
                >
                  Continuer les achats
                </button>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 md:gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 md:w-20 h-16 md:h-20 object-cover bg-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm md:text-base">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.brand}</p>
                      <p className="font-semibold text-sm md:text-base">€{item.price.toLocaleString()}</p>
                      
                      <div className="flex items-center justify-end mt-2">
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-xs md:text-sm text-red-600 hover:text-red-800"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-4 md:p-6">
              <div className="flex justify-between mb-4">
                <span className="font-semibold text-sm md:text-base">Total</span>
                <span className="font-semibold text-sm md:text-base">€{totalPrice.toLocaleString()}</span>
              </div>
              <button 
                onClick={onCheckout}
                className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors text-sm md:text-base"
              >
PROCÉDER AU PAIEMENT
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;