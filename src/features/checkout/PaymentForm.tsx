import React, { useState } from 'react';
import { PaymentMethod } from '../../types';
import { createCheckoutSession } from '../../services/stripeService';

interface PaymentFormProps {
  paymentMethod: PaymentMethod;
  onSubmit: (payment: PaymentMethod) => void;
  onBack: () => void;
  orderData: any;
  userId: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  paymentMethod, 
  onSubmit, 
  onBack, 
  orderData,
  userId
}) => {
  const [formData, setFormData] = useState<PaymentMethod>(paymentMethod);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Si l'utilisateur choisit Stripe (carte bancaire), rediriger vers Stripe Checkout
      if (formData.type === 'card') {
        const result = await createCheckoutSession(orderData, userId);
        
        if (!result.success) {
          setError(result.error || 'Une erreur est survenue lors de la redirection vers Stripe');
        }
        
        // Si la redirection réussit, l'utilisateur est redirigé vers Stripe
        // et ne revient pas à ce formulaire
        return;
      }
      
      // Pour les autres méthodes de paiement, continuer avec le processus existant
      onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Méthode de paiement</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Options de paiement */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="card"
              name="type"
              value="card"
              checked={formData.type === 'card'}
              onChange={handleChange}
              className="h-4 w-4 text-black focus:ring-black"
            />
            <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700">
              Carte bancaire (Stripe)
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="paypal"
              name="type"
              value="paypal"
              checked={formData.type === 'paypal'}
              onChange={handleChange}
              className="h-4 w-4 text-black focus:ring-black"
            />
            <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
              PayPal
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="bank"
              name="type"
              value="bank"
              checked={formData.type === 'bank'}
              onChange={handleChange}
              className="h-4 w-4 text-black focus:ring-black"
            />
            <label htmlFor="bank" className="ml-3 block text-sm font-medium text-gray-700">
              Virement bancaire
            </label>
          </div>
        </div>
        
        {/* Informations carte bancaire (Stripe) */}
        {formData.type === 'card' && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-800">
              Vous serez redirigé vers Stripe pour finaliser votre paiement de manière sécurisée.
            </p>
            <div className="mt-4 flex items-center">
              <div className="flex space-x-2">
                <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">MC</span>
                </div>
                <div className="w-10 h-6 bg-yellow-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AMEX</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Informations PayPal */}
        {formData.type === 'paypal' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              Vous serez redirigé vers PayPal pour finaliser votre paiement de manière sécurisée.
            </p>
          </div>
        )}
        
        {/* Informations virement bancaire */}
        {formData.type === 'bank' && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-800">
              Vous recevrez les coordonnées bancaires pour effectuer le virement. 
              Votre commande sera traitée une fois le paiement confirmé.
            </p>
          </div>
        )}
        
        {/* Boutons d'action */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            disabled={isProcessing}
          >
            Retour
          </button>
          
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            disabled={isProcessing}
          >
            {isProcessing ? 'Redirection en cours...' : 'Passer la commande'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;