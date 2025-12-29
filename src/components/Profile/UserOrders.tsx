import React, { useState } from 'react';
import { Package, Eye, Calendar, CreditCard, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { useUserOrders } from '../../hooks/useUserOrders';
import { getStatusLabel, getPaymentStatusLabel, getStatusColor, type UserOrder, type OrderItem } from '../../services/orderService';

interface UserOrdersProps {
  userId?: string;
  email?: string;
}

interface OrderDetailViewProps {
  order: UserOrder;
  onBack: () => void;
}

const OrderDetailView: React.FC<OrderDetailViewProps> = ({ order, onBack }) => {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-black mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour aux commandes
        </button>
      </div>

      <div className="space-y-6">
        {/* Informations commande */}
        <div className="border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <h3 className="text-xl font-semibold text-black mb-2">
                Commande {order.order_number}
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Passée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    getStatusColor(order.status) === 'green' ? 'bg-green-100 text-green-800' :
                    getStatusColor(order.status) === 'blue' ? 'bg-blue-100 text-blue-800' :
                    getStatusColor(order.status) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    getStatusColor(order.status) === 'red' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {getStatusLabel(order.status)}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    order.payment_status === 'succeeded' ? 'bg-green-100 text-green-800' :
                    order.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {getPaymentStatusLabel(order.payment_status)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-2xl font-bold text-black">
                €{order.total_amount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                {order.order_items.reduce((sum, item) => sum + item.quantity, 0)} article
                {order.order_items.reduce((sum, item) => sum + item.quantity, 0) > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Articles commandés */}
        <div className="border border-gray-200">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h4 className="font-semibold text-black">Articles commandés</h4>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {order.order_items.map((item: OrderItem) => {
                const snapshot = item.product_snapshot;
                const mainImage = snapshot.images && snapshot.images.length > 0 
                  ? snapshot.images[snapshot.main_image_index || 0] 
                  : null;

                return (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-100 rounded">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {mainImage ? (
                        <img 
                          src={mainImage} 
                          alt={snapshot.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h5 className="font-medium text-black">{snapshot.name}</h5>
                      <p className="text-sm text-gray-600">
                        {snapshot.brand_name} • {snapshot.category_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Code: {snapshot.product_code} • État: {snapshot.condition}
                      </p>
                      {snapshot.genre && (
                        <p className="text-xs text-gray-500">Genre: {snapshot.genre}</p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium text-black">
                        {item.quantity} × €{item.unit_price.toFixed(2)}
                      </p>
                      <p className="text-sm font-semibold text-black">
                        €{item.line_total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Résumé financier */}
        <div className="border border-gray-200 p-6">
          <h4 className="font-semibold text-black mb-4">Résumé de la commande</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Sous-total</span>
              <span className="font-medium">€{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Frais de livraison</span>
              <span className="font-medium">€{order.shipping_cost.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-4">
              <div className="flex justify-between">
                <span className="font-semibold text-black">Total</span>
                <span className="font-bold text-xl text-black">€{order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserOrders: React.FC<UserOrdersProps> = ({ userId, email }) => {
  const { orders, stats, loading, error, refetch } = useUserOrders(userId, email);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Si une commande est sélectionnée, afficher la vue détaillée
  const selectedOrder = selectedOrderId ? orders.find(order => order.id === selectedOrderId) : null;
  if (selectedOrder) {
    return (
      <OrderDetailView 
        order={selectedOrder} 
        onBack={() => setSelectedOrderId(null)} 
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500 mr-3" />
        <span className="text-gray-500">Chargement de vos commandes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800 mb-4">Erreur: {error}</p>
          <button 
            onClick={refetch}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
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
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande</h3>
        <p className="text-gray-500">Vous n'avez pas encore passé de commande.</p>
        <p className="text-sm text-gray-400 mt-2">
          Découvrez nos collections et passez votre première commande !
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Mes Commandes</h2>
        <button 
          onClick={refetch}
          className="text-gray-500 hover:text-black transition-colors"
          title="Actualiser"
        >
          <Package className="h-5 w-5" />
        </button>
      </div>

      {/* Statistiques */}
      {stats.total_orders > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded">
            <div className="flex items-center">
              <ShoppingBag className="h-6 w-6 text-black mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total commandes</p>
                <p className="text-xl font-bold text-black">{stats.total_orders}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <div className="flex items-center">
              <CreditCard className="h-6 w-6 text-black mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total dépensé</p>
                <p className="text-xl font-bold text-black">€{stats.total_spent.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <div className="flex items-center">
              <Package className="h-6 w-6 text-black mr-3" />
              <div>
                <p className="text-sm text-gray-600">Panier moyen</p>
                <p className="text-xl font-bold text-black">€{stats.average_order_value.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liste des commandes */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 p-6 rounded hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="font-semibold text-black mr-4">
                    Commande {order.order_number}
                  </h3>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    getStatusColor(order.status) === 'green' ? 'bg-green-100 text-green-800' :
                    getStatusColor(order.status) === 'blue' ? 'bg-blue-100 text-blue-800' :
                    getStatusColor(order.status) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    getStatusColor(order.status) === 'red' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <Calendar className="h-4 w-4 inline mr-2" />
                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p>
                    <Package className="h-4 w-4 inline mr-2" />
                    {order.order_items.reduce((sum, item) => sum + item.quantity, 0)} article
                    {order.order_items.reduce((sum, item) => sum + item.quantity, 0) > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center mt-4 md:mt-0">
                <div className="text-right mr-4">
                  <p className="text-xl font-bold text-black">€{order.total_amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">
                    {getPaymentStatusLabel(order.payment_status)}
                  </p>
                </div>
                
                <button
                  onClick={() => setSelectedOrderId(order.id)}
                  className="flex items-center px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors rounded"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Détails
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrders;