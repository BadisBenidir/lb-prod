import React, { useState } from 'react';
import { Package, Eye, Calendar, CreditCard, ShoppingBag, ArrowLeft, Loader2, Truck, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useUserOrders } from '../../hooks/useUserOrders';
import { getStatusLabel, getPaymentStatusLabel, getStatusColor, type UserOrder, type OrderItem } from '../../services/orderService';

interface UserOrdersMobileProps {
  userId?: string;
  email?: string;
}

interface OrderDetailMobileProps {
  order: UserOrder;
  onBack: () => void;
}

const OrderDetailMobile: React.FC<OrderDetailMobileProps> = ({ order, onBack }) => {
  const getStatusIcon = (status: string) => {
    switch (getStatusColor(status)) {
      case 'green': return <CheckCircle className="h-4 w-4" />;
      case 'blue': return <Truck className="h-4 w-4" />;
      case 'yellow': return <Clock className="h-4 w-4" />;
      case 'red': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPaymentIcon = (status: string) => {
    if (status === 'succeeded') return <CheckCircle className="h-4 w-4" />;
    if (status === 'failed') return <XCircle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-black transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">Mes Commandes</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-900 mb-1">
              Commande #{order.order_number}
            </h1>
            <p className="text-sm text-gray-600">
              {new Date(order.created_at).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              {getStatusIcon(order.status)}
              <span className="text-xs font-medium text-gray-600 ml-2">STATUT</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {getStatusLabel(order.status)}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              {getPaymentIcon(order.payment_status)}
              <span className="text-xs font-medium text-gray-600 ml-2">PAIEMENT</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {getPaymentStatusLabel(order.payment_status)}
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center mr-3">
                <ShoppingBag className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Résumé</p>
                <p className="text-xs text-gray-500">
                  {order.order_items.reduce((sum, item) => sum + item.quantity, 0)} article(s)
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">
                €{order.total_amount.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Sous-total</span>
              <span className="font-medium">€{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Livraison</span>
              <span className="font-medium">€{order.shipping_cost.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-lg text-gray-900">€{order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Articles */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Articles commandés</h3>
          </div>
          
          <div className="p-4 space-y-4">
            {order.order_items.map((item: OrderItem) => {
              const snapshot = item.product_snapshot;
              const mainImage = snapshot.images && snapshot.images.length > 0 
                ? snapshot.images[snapshot.main_image_index || 0] 
                : null;

              return (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-14 h-14 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                    {mainImage ? (
                      <img 
                        src={mainImage} 
                        alt={snapshot.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{snapshot.name}</p>
                    <p className="text-xs text-gray-600 truncate">
                      {snapshot.brand_name} • {snapshot.condition}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">
                        {item.quantity} × €{item.unit_price.toFixed(2)}
                      </p>
                      <p className="font-semibold text-sm text-gray-900">
                        €{item.line_total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const UserOrdersMobile: React.FC<UserOrdersMobileProps> = ({ userId, email }) => {
  const { orders, stats, loading, error, refetch } = useUserOrders(userId, email);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const selectedOrder = selectedOrderId ? orders.find(order => order.id === selectedOrderId) : null;
  
  if (selectedOrder) {
    return (
      <OrderDetailMobile 
        order={selectedOrder} 
        onBack={() => setSelectedOrderId(null)} 
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 bg-yellow-400/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Loader2 className="h-6 w-6 animate-spin text-yellow-600" />
          </div>
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 rounded-2xl p-6 max-w-sm mx-auto">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-red-800 font-medium mb-4">Erreur: {error}</p>
          <button 
            onClick={refetch}
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-500 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-2xl p-8 max-w-sm mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune commande</h3>
          <p className="text-gray-600 text-sm">
            Vous n'avez pas encore passé de commande.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards - Mobile */}
      {stats.total_orders > 0 && (
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-5 text-black shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black/80 mb-1">Total dépensé</p>
                <p className="text-2xl font-bold">€{stats.total_spent.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center mb-2">
                <ShoppingBag className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-xs font-medium text-gray-600">COMMANDES</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{stats.total_orders}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center mb-2">
                <Package className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-xs font-medium text-gray-600">PANIER MOYEN</span>
              </div>
              <p className="text-xl font-bold text-gray-900">€{stats.average_order_value.toFixed(0)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const statusColor = getStatusColor(order.status);
          const mainItem = order.order_items[0];
          const snapshot = mainItem?.product_snapshot;
          const mainImage = snapshot?.images && snapshot.images.length > 0 
            ? snapshot.images[snapshot.main_image_index || 0] 
            : null;
          const itemsCount = order.order_items.reduce((sum, item) => sum + item.quantity, 0);

          return (
            <div 
              key={order.id} 
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedOrderId(order.id)}
            >
              <div className="flex items-center space-x-4">
                {/* Product Image */}
                <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  {mainImage ? (
                    <img 
                      src={mainImage} 
                      alt={snapshot?.name || 'Produit'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Order Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      Commande #{order.order_number}
                    </p>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                      statusColor === 'green' ? 'bg-green-100 text-green-800' :
                      statusColor === 'blue' ? 'bg-blue-100 text-blue-800' :
                      statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      statusColor === 'red' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {itemsCount} article{itemsCount > 1 ? 's' : ''}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        €{order.total_amount.toFixed(2)}
                      </p>
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">Voir détails</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserOrdersMobile;