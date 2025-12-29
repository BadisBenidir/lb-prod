import React, { createContext, useContext, useMemo } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';

// Types pour le contexte
type CartContextType = ReturnType<typeof useCart>;

const CartContext = createContext<CartContextType | null>(null);

// Hook pour utiliser le contexte du panier
export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

// Provider du contexte panier
interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { userId, isAuthInitialized } = useAuth();
  const location = useLocation();
  
  // Stabiliser userId - simple et clair
  const stableUserId = useMemo(() => {
    // Attendre que l'auth soit initialisée pour éviter les changements d'état
    if (!isAuthInitialized) {
      return undefined;
    }
    return userId;
  }, [userId, isAuthInitialized]);
  
  // Désactiver la vérification des produits vendus sur les pages de checkout success/cancel
  const skipSoldProductsCheck = useMemo(() => {
    return location.pathname.includes('/checkout/success') || 
           location.pathname.includes('/checkout/cancel');
  }, [location.pathname]);
  
  const cartValue = useCart(stableUserId, skipSoldProductsCheck);

  return (
    <CartContext.Provider value={cartValue}>
      {children}
    </CartContext.Provider>
  );
};