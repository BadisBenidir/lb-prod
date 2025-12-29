import { useState, useEffect } from 'react';
import { getAllUserOrders, getUserOrderStats, type UserOrder, type OrderStats } from '../services/orderService';

export const useUserOrders = (userId?: string, email?: string) => {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    total_orders: 0,
    total_spent: 0,
    average_order_value: 0,
    last_order_date: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!userId || !email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Récupérer les commandes
      const userOrders = await getAllUserOrders(userId, email);
      setOrders(userOrders);

      // Récupérer les statistiques
      const orderStats = await getUserOrderStats(userId, email);
      setStats(orderStats);

    } catch (err) {
      console.error('Error fetching user orders:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId, email]);

  const refetch = () => {
    fetchOrders();
  };

  return {
    orders,
    stats,
    loading,
    error,
    refetch
  };
};