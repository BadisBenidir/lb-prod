import { useState, useEffect } from 'react';
import { favoriteService } from '../services/favoriteService';

/**
 * Hook léger pour vérifier si un produit spécifique est en favori
 * Utile pour les composants ProductCard qui n'ont besoin que de cette info
 */
export const useIsFavorite = (userId: string | null, productId: string) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vérifier le statut favori
  const checkFavoriteStatus = async () => {
    if (!userId || !productId) {
      setIsFavorite(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await favoriteService.isFavorite(userId, productId);
    
    if (result.success) {
      setIsFavorite(result.isFavorite || false);
    } else {
      setError(result.error || 'Erreur lors de la vérification');
      setIsFavorite(false);
    }

    setIsLoading(false);
  };

  // Basculer l'état favori avec optimisation optimiste
  const toggleFavorite = async () => {
    if (!userId) {
      setError('Utilisateur non connecté');
      return { success: false, error: 'Utilisateur non connecté' };
    }

    // Optimisation optimiste : changer l'état immédiatement
    const previousState = isFavorite;
    setIsFavorite(!previousState);
    setError(null);

    const result = await favoriteService.toggleFavorite(userId, productId);
    
    if (!result.success) {
      // Revenir à l'état précédent en cas d'erreur
      setIsFavorite(previousState);
      setError(result.error || 'Erreur lors de la modification');
    }

    return result;
  };

  // Vérifier le statut au montage et quand les paramètres changent
  useEffect(() => {
    checkFavoriteStatus();
  }, [userId, productId]);

  return {
    isFavorite,
    isLoading,
    error,
    toggleFavorite,
    refresh: checkFavoriteStatus,
    clearError: () => setError(null)
  };
};