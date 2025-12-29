import { useState, useCallback } from 'react';
import { ShippingService, ShippingAddress, ShippingRate } from '../services/shippingService';

interface UseShippingReturn {
  rates: ShippingRate[];
  loading: boolean;
  error: string | null;
  calculateRates: (toAddress: ShippingAddress) => Promise<void>;
  validateAddress: (address: ShippingAddress) => Promise<boolean>;
  clearError: () => void;
}

/**
 * Hook personnalisé pour gérer les frais d'expédition
 */
export function useShipping(): UseShippingReturn {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Calcule les frais d'expédition pour une adresse de destination
   */
  const calculateRates = useCallback(async (toAddress: ShippingAddress) => {
    setLoading(true);
    setError(null);

    try {
      // Récupération des articles du panier depuis le store
      // Note: Vous devrez adapter cette partie selon votre store Zustand
      const cartItems = []; // TODO: Récupérer depuis le store

      if (cartItems.length === 0) {
        setError('Votre panier est vide');
        setLoading(false);
        return;
      }

      // Calcul des frais d'expédition
      const shippingRates = await ShippingService.calculateCartShipping(cartItems, toAddress);
      setRates(shippingRates);

      if (shippingRates.length === 0) {
        setError('Aucune option d\'expédition disponible pour cette adresse');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du calcul des frais d\'expédition');
      setRates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Valide une adresse d'expédition
   */
  const validateAddress = useCallback(async (address: ShippingAddress): Promise<boolean> => {
    try {
      return await ShippingService.validateAddress(address);
    } catch (err) {
      console.error('Erreur lors de la validation d\'adresse:', err);
      return false;
    }
  }, []);

  /**
   * Efface les erreurs
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    rates,
    loading,
    error,
    calculateRates,
    validateAddress,
    clearError,
  };
}

/**
 * Hook pour les frais d'expédition avec panier intégré
 */
export function useShippingWithCart(cartItems: any[]): UseShippingReturn {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateRates = useCallback(async (toAddress: ShippingAddress) => {
    setLoading(true);
    setError(null);

    try {
      if (cartItems.length === 0) {
        setError('Votre panier est vide');
        setLoading(false);
        return;
      }

      const shippingRates = await ShippingService.calculateCartShipping(cartItems, toAddress);
      setRates(shippingRates);

      if (shippingRates.length === 0) {
        setError('Aucune option d\'expédition disponible pour cette adresse');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du calcul des frais d\'expédition');
      setRates([]);
    } finally {
      setLoading(false);
    }
  }, [cartItems]);

  const validateAddress = useCallback(async (address: ShippingAddress): Promise<boolean> => {
    try {
      return await ShippingService.validateAddress(address);
    } catch (err) {
      console.error('Erreur lors de la validation d\'adresse:', err);
      return false;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    rates,
    loading,
    error,
    calculateRates,
    validateAddress,
    clearError,
  };
}

