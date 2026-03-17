import React, { useEffect, useState } from 'react';
import { Check, Package, ArrowRight, Download, Mail, Loader2, AlertCircle } from 'lucide-react';
import { processOrder } from '../services/orderService';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { useCartContext } from '../contexts/CartContext';

interface CheckoutSuccessPageProps {
  onContinueShopping: () => void;
  sessionId: string | null;
}

const CheckoutSuccessPage: React.FC<CheckoutSuccessPageProps> = ({ onContinueShopping, sessionId: propSessionId }) => {
  const [sessionId, setSessionId] = useState<string | null>(propSessionId);
  const [isProcessing, setIsProcessing] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasProcessed, setHasProcessed] = useState(false); // Éviter les appels multiples
  const { userId } = useAuth();
  const { user, customer } = useProfile();
  const { clearCart } = useCartContext();
  
  useEffect(() => {
    const processStripeOrder = async () => {
      // Éviter les appels multiples
      if (hasProcessed) {
        console.log('🚫 Traitement déjà en cours ou terminé, ignorer');
        return;
      }
      
      setHasProcessed(true);
      
      try {
        // Utiliser le sessionId passé en props
        const id = sessionId || propSessionId;
        setSessionId(id);

        console.log('🔍 Session ID reçu en props:', propSessionId);
        console.log('🔍 Session ID utilisé:', id);

        if (!id) {
          throw new Error('Aucun ID de session trouvé');
        }

        console.log('🔄 Traitement de la commande pour session:', id);

        // Traiter la commande via la fonction Edge
        const result = await processOrder(id, userId, customer?.id);

        if (result.success) {
          console.log('✅ Commande traitée:', result.orderNumber);
          setOrderData(result);
          
          // Vider le panier après succès de la commande
          console.log('🛒 Vidage du panier après commande réussie');
          await clearCart();
          console.log('✅ Panier vidé');
        } else {
          throw new Error(result.error || 'Erreur lors du traitement de la commande');
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
        console.error('❌ Erreur traitement commande:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    };

    processStripeOrder();
  }, [userId, customer?.id, propSessionId, clearCart]);

  // État de chargement
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Traitement de votre commande...
              </h1>
              <p className="text-gray-600 mb-6">
                Veuillez patienter pendant que nous finalisons votre commande.
              </p>
              <div className="animate-pulse">
                <div className="h-2 bg-blue-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Erreur de traitement
              </h1>
              <p className="text-gray-600 mb-6">
                Une erreur s'est produite lors du traitement de votre commande.
              </p>
              <div className="bg-red-50 rounded-lg p-4 mb-6">
                <div className="text-sm text-red-700">{error}</div>
              </div>
              <button
                onClick={onContinueShopping}
                className="w-full bg-red-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Retourner au site
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // État de succès
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Animation de succès */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
            <Check className="h-12 w-12 text-green-600 relative z-10" />
          </div>
        </div>

        {/* Card principale */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              🎉 Commande Confirmée !
            </h1>
            <p className="text-gray-600 mb-6">
              Votre commande a été traitée avec succès. Vous allez recevoir un email de confirmation.
            </p>

            {/* Informations de commande */}
            {orderData && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-600 mb-1">Numéro de commande</div>
                <div className="font-bold text-lg text-gray-900 mb-2">
                  {orderData.orderNumber}
                </div>
                <div className="text-sm text-gray-600 mb-1">Email de confirmation</div>
                <div className="text-sm text-gray-900 mb-2">{orderData.email}</div>
                <div className="text-sm text-gray-600 mb-1">Montant total</div>
                <div className="font-semibold text-gray-900">
                  €{orderData.totalAmount?.toFixed(2)}
                </div>
              </div>
            )}


            {/* Étapes suivantes */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-left">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email de confirmation</h3>
                  <p className="text-sm text-gray-600">Vous recevrez un email dans les prochaines minutes</p>
                </div>
              </div>

              <div className="flex items-center text-left">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Préparation de commande</h3>
                  <p className="text-sm text-gray-600">Votre commande sera préparée sous 24-48h</p>
                </div>
              </div>

              <div className="flex items-center text-left">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Download className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Suivi de livraison</h3>
                  <p className="text-sm text-gray-600">Vous recevrez un numéro de suivi par email</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={onContinueShopping}
                className="w-full bg-black text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <span>Continuer mes achats</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
              
              <button
                onClick={() => window.print()}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Imprimer la confirmation
              </button>
            </div>
          </div>

          {/* Footer de la card */}
          <div className="bg-gray-50 px-8 py-4">
            <div className="flex items-center justify-center text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Paiement sécurisé par Stripe
              </div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Une question ? Contactez-nous à{' '}
            <a href="mailto:sav@ligne-blanche.fr" className="text-blue-600 hover:underline">
              sav@ligne-blanche.fr
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;