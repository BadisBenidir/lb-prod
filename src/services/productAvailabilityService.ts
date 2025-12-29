import { supabase } from '../lib/supabase';
import { CartItem } from '../types';

export interface ProductAvailabilityResult {
  allAvailable: boolean;
  unavailableProducts: Array<{
    id: string;
    name: string;
    reason: string;
  }>;
  availableProducts: CartItem[];
}

/**
 * Vérifie la disponibilité de tous les produits du panier
 */
export const checkCartProductsAvailability = async (cartItems: CartItem[]): Promise<ProductAvailabilityResult> => {
  try {
    console.log('🔍 Vérification disponibilité produits:', cartItems.map(item => item.id));

    if (cartItems.length === 0) {
      return {
        allAvailable: true,
        unavailableProducts: [],
        availableProducts: []
      };
    }

    // Récupérer le statut actuel de tous les produits
    const productIds = cartItems.map(item => item.id);
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, status')
      .in('id', productIds);

    if (error) {
      throw new Error(`Erreur vérification produits: ${error.message}`);
    }

    const unavailableProducts: Array<{id: string; name: string; reason: string}> = [];
    const availableProducts: CartItem[] = [];

    // Vérifier chaque produit du panier
    for (const cartItem of cartItems) {
      const product = products?.find(p => p.id === cartItem.id);
      
      if (!product) {
        // Produit n'existe plus
        unavailableProducts.push({
          id: cartItem.id,
          name: cartItem.name,
          reason: 'Produit introuvable'
        });
      } else if (product.status !== 'for-sale-online') {
        // Produit plus disponible à la vente
        let reason = 'Plus disponible';
        if (product.status === 'sold-online') {
          reason = 'Déjà vendu';
        } else if (product.status === 'sold-other-platform') {
          reason = 'Vendu sur autre plateforme';
        } else if (product.status === 'draft') {
          reason = 'Plus en vente';
        }
        
        unavailableProducts.push({
          id: cartItem.id,
          name: cartItem.name,
          reason
        });
      } else {
        // Produit disponible
        availableProducts.push(cartItem);
      }
    }

    const allAvailable = unavailableProducts.length === 0;

    console.log('✅ Résultat vérification:', {
      total: cartItems.length,
      disponibles: availableProducts.length,
      indisponibles: unavailableProducts.length
    });

    return {
      allAvailable,
      unavailableProducts,
      availableProducts
    };

  } catch (error) {
    console.error('❌ Erreur vérification disponibilité:', error);
    throw error;
  }
};

/**
 * Réserve temporairement des produits (optionnel, pour plus tard)
 */
export const reserveProducts = async (productIds: string[], userId: string, durationMinutes: number = 15) => {
  // TODO: Implémenter si nécessaire
  // Créer une table "product_reservations" avec expiration
};

/**
 * Libère les réservations expirées (optionnel, pour plus tard)
 */
export const releaseExpiredReservations = async () => {
  // TODO: Implémenter si nécessaire
};