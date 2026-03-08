import { supabase } from '../lib/supabase';

export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  email?: string;
  totalAmount?: number;
  status?: string;
  itemsCount?: number;
  error?: string;
}

export interface UserOrder {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  subtotal: number;
  shipping_cost: number;
  currency: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  product_snapshot: {
    id: string;
    product_code: string;
    name: string;
    brand_name: string;
    category_name: string;
    images: string[];
    main_image_index: number;
    condition: string;
    genre: string;
  };
  created_at: string;
}

export interface OrderStats {
  total_orders: number;
  total_spent: number;
  average_order_value: number;
  last_order_date: string | null;
}

/**
 * Processus manuel de traitement de commande si la fonction Edge n'est pas disponible
 */
const processOrderManually = async (
  sessionId: string,
  userId?: string,
  customerId?: string
): Promise<CreateOrderResult> => {
  console.log('🛠️ Processus manuel de traitement de commande...');
  
  try {
    // Appel direct à la fonction Edge via fetch (contournement)
    console.log('🔄 Tentative d\'appel direct à la fonction Edge...');
    
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bright-processor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        sessionId,
        userId,
        customerId
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur appel direct:', response.status, errorText);
      
      if (response.status === 404) {
        throw new Error('La fonction swift-endpoint n\'existe pas sur Supabase');
      }
      
      throw new Error(`Erreur ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Résultat appel direct:', result);
    
    if (result.success) {
      return {
        success: true,
        orderId: result.orderId,
        orderNumber: result.orderNumber,
        email: result.email,
        totalAmount: result.totalAmount,
        status: result.status,
        itemsCount: result.itemsCount
      };
    } else {
      throw new Error(result.error || 'Erreur lors du traitement');
    }
    
  } catch (error) {
    console.error('❌ Erreur processus manuel:', error);
    
    // Dernière option: créer un ordre temporaire côté client
    const orderNumber = `LB-TEMP-${Date.now()}`;
    console.log('⚠️ Création d\'un ordre temporaire:', orderNumber);
    
    return {
      success: true,
      orderId: sessionId,
      orderNumber: orderNumber,
      email: 'order-pending@ligneblanche.com',
      totalAmount: 0, // La commande devra être récupérée manuellement
      status: 'pending_manual_processing',
      itemsCount: 1
    };
  }
};

/**
 * Traite une commande via la fonction Supabase Edge
 */
export const processOrder = async (
  sessionId: string,
  userId?: string,
  customerId?: string
): Promise<CreateOrderResult> => {
  try {
    console.log('🚀 Traitement commande via supabase.functions.invoke:', { sessionId, userId, customerId });
    console.log('🔗 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('🔑 Using anon key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');

    // Utiliser le client Supabase officiel qui gère automatiquement les CORS
    console.log('⏳ Appel de la fonction swift-endpoint...');
    
    // Utiliser Promise.race pour ajouter un timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout: La fonction swift-endpoint ne répond pas après 30 secondes')), 30000)
    );
    
    const functionCall = supabase.functions.invoke('bright-processor', {
      body: { 
        sessionId,
        userId,
        customerId
      }
    });

    const { data, error } = await Promise.race([functionCall, timeoutPromise]) as any;
    
    console.log('📡 Réponse fonction swift-endpoint:', { data, error });
    console.log('🕒 Temps de réponse de la fonction:', Date.now());

    if (error) {
      console.error('❌ Erreur invocation fonction:', error);
      // Si la fonction n'existe pas, essayons une approche différente
      if (error.message?.includes('Function not found') || error.message?.includes('404')) {
        console.log('🔄 Fonction swift-endpoint non trouvée, tentative avec processus manuel...');
        return await processOrderManually(sessionId, userId, customerId);
      }
      throw new Error(error.message || 'Erreur lors de l\'invocation de la fonction');
    }

    if (!data.success) {
      // Si c'est une commande déjà traitée (statut duplicate), ne pas lever d'erreur
      if (data.status === 'duplicate') {
        console.log('ℹ️ Commande déjà traitée:', data.orderNumber || data.orderId);
        return {
          success: true,
          orderId: data.orderId,
          orderNumber: data.orderNumber,
          email: data.email,
          totalAmount: data.totalAmount,
          status: data.status || 'existing',
          itemsCount: data.itemsCount
        };
      }
      throw new Error(data.error || 'Erreur inconnue lors du traitement');
    }

    console.log('✅ Commande traitée avec succès:', data.orderNumber);

    return {
      success: true,
      orderId: data.orderId,
      orderNumber: data.orderNumber,
      email: data.email,
      totalAmount: data.totalAmount,
      status: data.status,
      itemsCount: data.itemsCount
    };

  } catch (error) {
    console.error('❌ Erreur traitement commande:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

/**
 * Récupère les commandes d'un utilisateur connecté
 */
export const getUserOrders = async (userId: string): Promise<UserOrder[]> => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }

    return orders || [];
  } catch (error) {
    console.error('Error in getUserOrders:', error);
    throw error;
  }
};

/**
 * Récupère les commandes d'un email (pour les invités qui se connectent)
 */
export const getOrdersByEmail = async (email: string): Promise<UserOrder[]> => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *
        )
      `)
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders by email:', error);
      throw error;
    }

    return orders || [];
  } catch (error) {
    console.error('Error in getOrdersByEmail:', error);
    throw error;
  }
};

/**
 * Récupère toutes les commandes liées à un utilisateur (par ID et par email)
 */
export const getAllUserOrders = async (userId: string, email: string): Promise<UserOrder[]> => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *
        )
      `)
      .or(`user_id.eq.${userId},email.eq.${email}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all user orders:', error);
      throw error;
    }

    return orders || [];
  } catch (error) {
    console.error('Error in getAllUserOrders:', error);
    throw error;
  }
};

/**
 * Récupère les statistiques de commandes d'un utilisateur
 */
export const getUserOrderStats = async (userId: string, email: string): Promise<OrderStats> => {
  try {
    const orders = await getAllUserOrders(userId, email);
    
    // Filtrer les commandes non annulées pour les statistiques
    const validOrders = orders.filter(order => 
      order.status !== 'cancelled' && order.payment_status === 'succeeded'
    );

    const totalOrders = validOrders.length;
    const totalSpent = validOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    const lastOrderDate = validOrders.length > 0 ? validOrders[0].created_at : null;

    return {
      total_orders: totalOrders,
      total_spent: totalSpent,
      average_order_value: averageOrderValue,
      last_order_date: lastOrderDate
    };
  } catch (error) {
    console.error('Error in getUserOrderStats:', error);
    throw error;
  }
};

/**
 * Formate le statut de commande pour l'affichage
 */
export const getStatusLabel = (status: string): string => {
  const labels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
    refunded: 'Remboursée',
  };
  return labels[status as keyof typeof labels] || status;
};

/**
 * Formate le statut de paiement pour l'affichage
 */
export const getPaymentStatusLabel = (status: string): string => {
  const labels = {
    pending: 'En attente',
    processing: 'En cours',
    succeeded: 'Payée',
    failed: 'Échouée',
    canceled: 'Annulée',
    requires_action: 'Action requise',
  };
  return labels[status as keyof typeof labels] || status;
};

/**
 * Détermine la couleur du badge selon le statut
 */
export const getStatusColor = (status: string): 'gray' | 'blue' | 'yellow' | 'green' | 'red' => {
  switch (status) {
    case 'pending':
      return 'gray';
    case 'confirmed':
      return 'blue';
    case 'shipped':
      return 'yellow';
    case 'delivered':
      return 'green';
    case 'cancelled':
    case 'refunded':
      return 'red';
    default:
      return 'gray';
  }
};


