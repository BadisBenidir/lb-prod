import { supabase } from '../lib/supabase';
import { Product } from '../types';

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface FavoriteServiceResult {
  success: boolean;
  error?: string;
}

export interface FavoriteProduct extends Product {
  favorite_id: string;
  favorited_at: string;
}

class FavoriteService {
  /**
   * Récupérer tous les favoris d'un utilisateur avec les détails des produits
   */
  async getUserFavorites(userId: string): Promise<{ success: boolean; favorites?: FavoriteProduct[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          created_at,
          product:products (
            id,
            name,
            brand:brands(name),
            category:categories(name),
            sale_price,
            purchase_price,
            images,
            main_image_index,
            condition,
            description,
            status,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des favoris:', error);
        return { success: false, error: error.message };
      }

      // Transformer les données pour correspondre à l'interface FavoriteProduct
      const favoritesRaw = (data || []).map((item): FavoriteProduct | null => {
          const product = Array.isArray(item.product) ? item.product[0] : item.product;
          if (!product) return null;
          
          console.log('product keys:', Object.keys(product));
          console.log('product.condition:', product.condition);
          console.log('raw product:', product);

          const images = product.images || [];
          const mainImageIndex = product.main_image_index || 0;
          const mainImage = images[mainImageIndex] || (images.length > 0 ? images[0] : '');
        
          // Convertir les conditions de la DB vers l'interface Product
          const conditionMap: Record<
            string,
            'New' | 'Excellent' | 'Very Good' | 'Good' | 'Fair'
          > = {
            'new': 'New',
            'excellent': 'Excellent',
            'very-good': 'Very Good',
            'good': 'Good',
            'fair': 'Fair',
          };

          const normalize = (s?: string) =>
            (s ?? '')
              .toLowerCase()
              .trim()
              .replace(/_/g, '-')
              .replace(/\s+/g, '-');

          const rawCondition = normalize(product.condition);

          console.log('[COND] DB condition =', product.condition);
          console.log('[COND] rawCondition =', rawCondition);
          console.log('[COND] mapped:', conditionMap[rawCondition ?? '']);
        
          return {

            condition: conditionMap[rawCondition ?? ''] ?? 'Good',
            id: product.id,
            name: product.name,
            brand: 
              (Array.isArray(product.brand) 
                ? (product.brand as any[])[0]?.name 
                : (product.brand as any)?.name) || "Marque inconnue",
            category: 
              (Array.isArray(product.category) 
                ? (product.category as any[])[0]?.name 
                : (product.category as any)?.name) || "Catégorie inconnue",
            price: product.sale_price,
            originalPrice: undefined, // Ne pas afficher le prix d'achat
            image: mainImage,
            description: product.description,
            inStock: product.status === 'for-sale-online',
            favorite_id: item.id,
            favorited_at: item.created_at,
        };
      });

      const favorites: FavoriteProduct[] = favoritesRaw.filter(
        (x): x is FavoriteProduct => x !== null
      );

      return { success: true, favorites };
    } catch (error) {
      console.error('Erreur dans getUserFavorites:', error);
      return { success: false, error: 'Erreur lors de la récupération des favoris' };
    }
  }

  /**
   * Ajouter un produit aux favoris
   */
  async addToFavorites(userId: string, productId: string): Promise<FavoriteServiceResult> {
    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          product_id: productId
        });

      if (error) {
        // Si erreur de contrainte d'unicité, le produit est déjà en favori
        if (error.code === '23505') {
          return { success: false, error: 'Ce produit est déjà dans vos favoris' };
        }
        console.error('Erreur lors de l\'ajout aux favoris:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur dans addToFavorites:', error);
      return { success: false, error: 'Erreur lors de l\'ajout aux favoris' };
    }
  }

  /**
   * Retirer un produit des favoris
   */
  async removeFromFavorites(userId: string, productId: string): Promise<FavoriteServiceResult> {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) {
        console.error('Erreur lors de la suppression des favoris:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur dans removeFromFavorites:', error);
      return { success: false, error: 'Erreur lors de la suppression des favoris' };
    }
  }

  /**
   * Vérifier si un produit est dans les favoris d'un utilisateur
   */
  async isFavorite(userId: string, productId: string): Promise<{ success: boolean; isFavorite?: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .limit(1);

      if (error) {
        console.error('Erreur lors de la vérification des favoris:', error);
        return { success: false, error: error.message };
      }

      return { success: true, isFavorite: (data && data.length > 0) };
    } catch (error) {
      console.error('Erreur dans isFavorite:', error);
      return { success: false, error: 'Erreur lors de la vérification des favoris' };
    }
  }

  /**
   * Basculer l'état favori d'un produit (ajouter ou retirer)
   */
  async toggleFavorite(userId: string, productId: string): Promise<{ success: boolean; action?: 'added' | 'removed'; error?: string }> {
    try {
      // Vérifier d'abord si le produit est déjà en favori
      const { success: checkSuccess, isFavorite, error: checkError } = await this.isFavorite(userId, productId);
      
      if (!checkSuccess) {
        return { success: false, error: checkError };
      }

      if (isFavorite) {
        // Retirer des favoris
        const result = await this.removeFromFavorites(userId, productId);
        return { 
          success: result.success, 
          action: result.success ? 'removed' : undefined, 
          error: result.error 
        };
      } else {
        // Ajouter aux favoris
        const result = await this.addToFavorites(userId, productId);
        return { 
          success: result.success, 
          action: result.success ? 'added' : undefined, 
          error: result.error 
        };
      }
    } catch (error) {
      console.error('Erreur dans toggleFavorite:', error);
      return { success: false, error: 'Erreur lors de la modification des favoris' };
    }
  }

  /**
   * Récupérer le nombre de favoris d'un utilisateur
   */
  async getFavoriteCount(userId: string): Promise<{ success: boolean; count?: number; error?: string }> {
    try {
      const { count, error } = await supabase
        .from('favorites')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) {
        console.error('Erreur lors du comptage des favoris:', error);
        return { success: false, error: error.message };
      }

      return { success: true, count: count || 0 };
    } catch (error) {
      console.error('Erreur dans getFavoriteCount:', error);
      return { success: false, error: 'Erreur lors du comptage des favoris' };
    }
  }
}

// Export d'une instance singleton
export const favoriteService = new FavoriteService();