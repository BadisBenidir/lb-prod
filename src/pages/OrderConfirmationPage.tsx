import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les paramètres de l'URL
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');
  const orderId = queryParams.get('order_id');

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        
        // Si nous avons un session_id, c'est un retour de Stripe
        if (sessionId) {
          // Vous pouvez appeler l'API Stripe pour vérifier le statut du paiement
          // Pour l'instant, nous allons simplement récupérer la commande
          if (orderId) {
            const { data, error: fetchError } = await supabase
              .from('orders')
              .select('*')
              .eq('id', orderId)
              .single();

            if (fetchError) throw new Error(fetchError.message);
            
            setOrderData(data);
          }
        } 
        // Sinon, c'est peut-être un retour direct avec orderId
        else if (orderId) {
          const { data, error: fetchError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

          if (fetchError) throw new Error(fetchError.message);
          
          setOrderData(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [sessionId, orderId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-700">Vérification de votre commande...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h1>
          
          <p className="text-gray-600 mb-8">
            {error}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
        {/* Icône de succès */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Commande confirmée !</h1>
        
        <p className="text-gray-600 mb-2">
          Merci pour votre commande. Un email de confirmation a été envoyé à votre adresse.
        </p>
        
        {orderData && (
          <p className="text-gray-600 mb-8">
            Numéro de commande : <span className="font-mono font-semibold">{orderData.order_code}</span>
          </p>
        )}
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h2 className="font-semibold text-gray-900 mb-4">Prochaines étapes</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Préparation de votre commande</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Expédition sous 1-2 jours ouvrés</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Livraison sous 3-5 jours ouvrés</span>
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/account/orders')}
            className="px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            Voir mes commandes
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Continuer mes achats
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;