import { supabase } from '../lib/supabase';
import { Product } from '../types';

// Types pour les données du panier depuis Supabase
export interface CartItemFromDB {
  cart_item_id: string;
  product_id: string;
  product_name: string;
  product_code: string;
  sale_price: number;
  brand_name: string;
  category_name: string;
  main_image_url: string | null;
  added_at: string;
}

// Service pour gérer le panier des utilisateurs connectés
export class CartService {
  /**
   * Ajouter un produit au panier d'un utilisateur connecté
   */
  static async addToCart(userId: string, productId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: userId,
          product_id: productId,
          session_id: null,
          expires_at: null
        });

      if (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      return false;
    }
  }

  /**
   * Supprimer un produit du panier d'un utilisateur connecté
   */
  static async removeFromCart(userId: string, productId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) {
        console.error('Erreur lors de la suppression du panier:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
      return false;
    }
  }

  /**
   * Récupérer tous les produits du panier d'un utilisateur connecté
   */
  static async getUserCart(userId: string): Promise<CartItemFromDB[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_user_cart_products', {
          p_user_id: userId
        });

      if (error) {
        console.error('Erreur lors de la récupération du panier:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error);
      return [];
    }
  }

  /**
   * Vider complètement le panier d'un utilisateur connecté
   */
  static async clearUserCart(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Erreur lors du vidage du panier:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors du vidage du panier:', error);
      return false;
    }
  }

  /**
   * Vérifier si un produit est déjà dans le panier d'un utilisateur
   */
  static async isProductInCart(userId: string, productId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .maybeSingle(); // Utiliser maybeSingle() au lieu de single()

      if (error) {
        console.error('Erreur lors de la vérification du panier:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Erreur lors de la vérification du panier:', error);
      return false;
    }
  }

  /**
   * Convertir les données du panier depuis Supabase vers le format de l'application
   */
  static convertCartItemFromDB(cartItem: CartItemFromDB): Product {
    return {
      id: cartItem.product_id,
      name: cartItem.product_name,
      brand: cartItem.brand_name,
      category: cartItem.category_name,
      price: cartItem.sale_price,
      image: cartItem.main_image_url || '/placeholder-image.jpg', // Image par défaut si null
      condition: 'Excellent', // Valeur par défaut
      description: '', // Valeur par défaut
      inStock: true, // Valeur par défaut
      productCode: cartItem.product_code
    };
  }
}
