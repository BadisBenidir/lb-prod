import { useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { CartService } from '../services/cartService';
import { supabase } from '../lib/supabase';

// Clé pour le sessionStorage
const SESSION_CART_KEY = 'ligne-blanche-guest-cart';

// Fonctions utilitaires pour le sessionStorage
const saveCartToSession = (cartItems: CartItem[]) => {
  try {
    sessionStorage.setItem(SESSION_CART_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du panier session:', error);
  }
};

const loadCartFromSession = (): CartItem[] => {
  try {
    const savedCart = sessionStorage.getItem(SESSION_CART_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Erreur lors du chargement du panier session:', error);
    return [];
  }
};

export const useCart = (userId?: string, skipSoldProductsCheck = false) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [showAlreadyInCartModal, setShowAlreadyInCartModal] = useState(false);
  const [showProductSoldModal, setShowProductSoldModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState<Product | null>(null);
  const [soldProducts, setSoldProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previousCartItemIds, setPreviousCartItemIds] = useState<string[]>([]);

  const addToCart = async (product: Product) => {
    setIsLoading(true);
    
    try {
      // Si l'utilisateur est connecté, synchroniser avec Supabase
      if (userId) {
        // Vérifier si le produit est déjà dans le panier Supabase
        const isInCart = await CartService.isProductInCart(userId, product.id);
        
        if (isInCart) {
          // Produit déjà dans le panier - afficher la modal d'avertissement
          setAddedProduct(product);
          setShowAlreadyInCartModal(true);
          return;
        }
        
        // Ajouter le produit au panier Supabase
        const success = await CartService.addToCart(userId, product.id);
        
        if (success) {
          // Ajouter au panier local
          setCartItems(prev => [...prev, { ...product, quantity: 1 }]);
          
          // Afficher la modal de confirmation
          setAddedProduct(product);
          setShowAddToCartModal(true);
        } else {
          console.error('Erreur lors de l\'ajout au panier Supabase');
        }
      } else {
        // Utilisateur non connecté - logique locale
        const existingItem = cartItems.find(item => item.id === product.id);
        
        if (existingItem) {
          setAddedProduct(product);
          setShowAlreadyInCartModal(true);
          return;
        }
        
        const newCartItems = [...cartItems, { ...product, quantity: 1 }];
        setCartItems(newCartItems);
        
        // Sauvegarder dans sessionStorage
        saveCartToSession(newCartItems);
        
        setAddedProduct(product);
        setShowAddToCartModal(true);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    setIsLoading(true);
    
    try {
      if (userId) {
        // Supprimer du panier Supabase
        const success = await CartService.removeFromCart(userId, productId);
        
        if (success) {
          // Supprimer du panier local
          setCartItems(prev => prev.filter(item => item.id !== productId));
        } else {
          console.error('Erreur lors de la suppression du panier Supabase');
        }
      } else {
        // Utilisateur non connecté - logique locale
        const newCartItems = cartItems.filter(item => item.id !== productId);
        setCartItems(newCartItems);
        
        // Sauvegarder dans sessionStorage
        saveCartToSession(newCartItems);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const newCartItems = cartItems.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCartItems(newCartItems);
    
    // Sauvegarder dans sessionStorage si utilisateur non connecté
    if (!userId) {
      saveCartToSession(newCartItems);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = async () => {
    console.log('🛒 clearCart() appelé pour userId:', userId);
    setIsLoading(true);
    
    try {
      if (userId) {
        console.log('🗑️ Vidage du panier Supabase pour user:', userId);
        // Vider le panier Supabase
        const success = await CartService.clearUserCart(userId);
        
        if (success) {
          console.log('✅ Panier Supabase vidé avec succès');
          // Vider le panier local
          setCartItems([]);
          console.log('✅ Panier local vidé');
        } else {
          console.error('❌ Erreur lors du vidage du panier Supabase');
          // Vider quand même le panier local en cas d'erreur DB
          setCartItems([]);
          console.log('⚠️ Panier local vidé malgré erreur DB');
        }
      } else {
        console.log('🗑️ Vidage du panier local (utilisateur non connecté)');
        // Utilisateur non connecté - logique locale
        setCartItems([]);
        
        // Vider le sessionStorage
        saveCartToSession([]);
        console.log('✅ Panier local et sessionStorage vidés');
      }
    } catch (error) {
      console.error('❌ Erreur lors du vidage du panier:', error);
      // Vider quand même le panier local en cas d'erreur
      setCartItems([]);
      console.log('⚠️ Panier local vidé malgré erreur');
    } finally {
      setIsLoading(false);
    }
  };

  // Charger le panier au démarrage
  useEffect(() => {
    const loadCart = async () => {
      // Si userId est undefined (auth en cours), ne pas charger
      if (userId === undefined) {
        return;
      }

      if (userId) {
        // Utilisateur connecté - charger depuis Supabase
        setIsLoading(true);
        try {
          const cartItemsFromDB = await CartService.getUserCart(userId);
          const convertedItems = cartItemsFromDB.map(item => ({
            ...CartService.convertCartItemFromDB(item),
            quantity: 1 // Chaque article est unique, donc quantity = 1
          }));
          
          // Détecter les produits vendus (comparaison avec panier précédent)
          if (previousCartItemIds.length > 0) {
            const currentIds = convertedItems.map(item => item.id);
            const soldProductIds = previousCartItemIds.filter(id => !currentIds.includes(id));
            
            if (soldProductIds.length > 0) {
              // Récupérer les données des produits vendus depuis le panier actuel
              const soldProductsData = cartItems.filter(item => soldProductIds.includes(item.id));
              
              if (soldProductsData.length > 0) {
                console.log('🔥 Produits vendus détectés:', soldProductsData.map(p => p.name));
                setSoldProducts(soldProductsData);
                setShowProductSoldModal(true);
              }
            }
          }
          
          setCartItems(convertedItems);
          setPreviousCartItemIds(convertedItems.map(item => item.id));
        } catch (error) {
          console.error('Erreur lors du chargement du panier:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Utilisateur non connecté (userId === null) - charger depuis sessionStorage
        const sessionCart = loadCartFromSession();
        
        // Détecter les produits vendus pour les utilisateurs non connectés
        if (previousCartItemIds.length > 0) {
          const currentIds = sessionCart.map(item => item.id);
          const soldProductIds = previousCartItemIds.filter(id => !currentIds.includes(id));
          
          if (soldProductIds.length > 0) {
            const soldProductsData = cartItems.filter(item => soldProductIds.includes(item.id));
            
            if (soldProductsData.length > 0) {
              console.log('🔥 Produits vendus détectés (invité):', soldProductsData.map(p => p.name));
              setSoldProducts(soldProductsData);
              setShowProductSoldModal(true);
            }
          }
        }
        
        setCartItems(sessionCart);
        setPreviousCartItemIds(sessionCart.map(item => item.id));
        setIsLoading(false);
      }
    };

    loadCart();
  }, [userId]);

  // Fonction pour vérifier les produits vendus (réutilisable)
  const checkSoldProducts = async () => {
    if (userId) {
      // Utilisateur connecté - recharger depuis DB
      try {
        const cartItemsFromDB = await CartService.getUserCart(userId);
        const convertedItems = cartItemsFromDB.map(item => ({
          ...CartService.convertCartItemFromDB(item),
          quantity: 1
        }));
        
        // Détecter les produits vendus
        if (previousCartItemIds.length > 0) {
          const currentIds = convertedItems.map(item => item.id);
          const soldProductIds = previousCartItemIds.filter(id => !currentIds.includes(id));
          
          if (soldProductIds.length > 0) {
            const soldProductsData = cartItems.filter(item => soldProductIds.includes(item.id));
            
            if (soldProductsData.length > 0) {
              console.log('🔥 Produits vendus détectés (connecté):', soldProductsData.map(p => p.name));
              setSoldProducts(soldProductsData);
              setShowProductSoldModal(true);
            }
          }
        }
        
        setCartItems(convertedItems);
        setPreviousCartItemIds(convertedItems.map(item => item.id));
      } catch (error) {
        console.error('Erreur lors du rechargement du panier:', error);
      }
    } else if (userId === null && cartItems.length > 0) {
      // Utilisateur NON connecté - vérifier le statut des produits locaux
      console.log('👤 Utilisateur invité - vérification statut produits:', cartItems.map(p => p.name));
      try {
        const productIds = cartItems.map(item => item.id);
        
        // Vérifier le statut de ces produits en DB
        const { data: dbProducts, error } = await supabase
          .from('products')
          .select('id, status')
          .in('id', productIds);
        
        if (error) {
          console.error('Erreur vérification produits:', error);
          return;
        }
        
        // Trouver les produits qui ne sont plus disponibles
        const soldProducts = cartItems.filter(cartItem => {
          const dbProduct = dbProducts?.find(p => p.id === cartItem.id);
          return !dbProduct || dbProduct.status !== 'for-sale-online';
        });
        
        if (soldProducts.length > 0) {
          console.log('🔥 Produits vendus détectés (invité):', soldProducts.map(p => p.name));
          
          // Supprimer les produits vendus du panier local
          const remainingProducts = cartItems.filter(cartItem => 
            !soldProducts.some(soldProduct => soldProduct.id === cartItem.id)
          );
          
          setCartItems(remainingProducts);
          saveCartToSession(remainingProducts);
          
          // Afficher la modal
          setSoldProducts(soldProducts);
          setShowProductSoldModal(true);
        }
      } catch (error) {
        console.error('Erreur vérification produits invité:', error);
      }
    }
  };

  // Vérification périodique des produits vendus (toutes les 30 secondes)
  useEffect(() => {
    if (cartItems.length === 0 || skipSoldProductsCheck) return;

    console.log('🕐 Démarrage vérification périodique des produits vendus');
    const interval = setInterval(checkSoldProducts, 30000); // 30 secondes

    return () => {
      console.log('🛑 Arrêt vérification périodique');
      clearInterval(interval);
    };
  }, [userId, cartItems.length, skipSoldProductsCheck]);

  // Vérification quand la page redevient visible
  useEffect(() => {
    if (skipSoldProductsCheck) return;
    
    const handleVisibilityChange = () => {
      if (!document.hidden && cartItems.length > 0) {
        console.log('📱 Page visible, vérification des produits vendus');
        setTimeout(checkSoldProducts, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userId, cartItems, skipSoldProductsCheck]);

  // Vérification immédiate au chargement si on a des produits
  useEffect(() => {
    if (cartItems.length > 0 && (userId !== undefined) && !skipSoldProductsCheck) {
      console.log('🔍 Vérification initiale des produits au chargement');
      setTimeout(checkSoldProducts, 2000); // Attendre 2s après le chargement
    }
  }, [cartItems.length, userId, skipSoldProductsCheck]);

  const closeAddToCartModal = () => {
    setShowAddToCartModal(false);
    setAddedProduct(null);
  };

  const closeAlreadyInCartModal = () => {
    setShowAlreadyInCartModal(false);
    setAddedProduct(null);
  };

  const closeProductSoldModal = () => {
    setShowProductSoldModal(false);
    setSoldProducts([]);
  };

  return {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    showAddToCartModal,
    showAlreadyInCartModal,
    showProductSoldModal,
    addedProduct,
    soldProducts,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
    closeAddToCartModal,
    closeAlreadyInCartModal,
    closeProductSoldModal
  };
};