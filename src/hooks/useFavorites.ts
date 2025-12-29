import { useState, useEffect, useCallback } from 'react';
import { favoriteService, FavoriteProduct } from '../services/favoriteService';

/**
 * Hook principal pour la gestion des favoris d'un utilisateur
 */
export const useFavorites = (userId: string | null) => {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les favoris de l'utilisateur
  const fetchFavorites = useCallback(async () => {
    if (!userId) {
      setFavorites([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await favoriteService.getUserFavorites(userId);
    
    if (result.success && result.favorites) {
      setFavorites(result.favorites);
    } else {
      setError(result.error || 'Erreur lors du chargement des favoris');
      setFavorites([]);
    }

    setIsLoading(false);
  }, [userId]);

  // Ajouter un produit aux favoris
  const addToFavorites = useCallback(async (productId: string) => {
    if (!userId) {
      setError('Utilisateur non connecté');
      return { success: false, error: 'Utilisateur non connecté' };
    }

    const result = await favoriteService.addToFavorites(userId, productId);
    
    if (result.success) {
      // Recharger les favoris pour mettre à jour l'état
      await fetchFavorites();
    } else {
      setError(result.error || 'Erreur lors de l\'ajout aux favoris');
    }

    return result;
  }, [userId, fetchFavorites]);

  // Retirer un produit des favoris
  const removeFromFavorites = useCallback(async (productId: string) => {
    if (!userId) {
      setError('Utilisateur non connecté');
      return { success: false, error: 'Utilisateur non connecté' };
    }

    const result = await favoriteService.removeFromFavorites(userId, productId);
    
    if (result.success) {
      // Mettre à jour l'état local immédiatement pour une meilleure UX
      setFavorites(prev => prev.filter(fav => fav.id !== productId));
    } else {
      setError(result.error || 'Erreur lors de la suppression des favoris');
    }

    return result;
  }, [userId]);

  // Basculer l'état favori d'un produit
  const toggleFavorite = useCallback(async (productId: string) => {
    if (!userId) {
      setError('Utilisateur non connecté');
      return { success: false, error: 'Utilisateur non connecté' };
    }

    const result = await favoriteService.toggleFavorite(userId, productId);
    
    if (result.success) {
      // Recharger les favoris pour mettre à jour l'état
      await fetchFavorites();
    } else {
      setError(result.error || 'Erreur lors de la modification des favoris');
    }

    return result;
  }, [userId, fetchFavorites]);

  // Vérifier si un produit est en favori
  const isFavorite = useCallback((productId: string): boolean => {
    return favorites.some(fav => fav.id === productId);
  }, [favorites]);

  // Obtenir le nombre total de favoris
  const favoriteCount = favorites.length;

  // Charger les favoris au montage du composant ou quand l'userId change
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    isLoading,
    error,
    favoriteCount,
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearError: () => setError(null)
  };
};