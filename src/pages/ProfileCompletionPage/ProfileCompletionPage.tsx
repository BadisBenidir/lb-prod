import React, { useState } from 'react';
import { Phone, Calendar, MapPin } from 'lucide-react';

interface ProfileCompletionData {
  phone: string;
  birthDate: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  country: string;
}

interface ProfileCompletionPageProps {
  onComplete: (data: ProfileCompletionData) => Promise<{ success: boolean; error?: string }>;
  onSkip: () => void;
  isLoading: boolean;
}

const ProfileCompletionPage: React.FC<ProfileCompletionPageProps> = ({ onComplete, onSkip, isLoading }) => {
  const [formData, setFormData] = useState<ProfileCompletionData>({
    phone: '',
    birthDate: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    country: 'France'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = await onComplete(formData);
    
    if (!result.success) {
      setError(result.error || 'Erreur lors de la sauvegarde du profil');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-black mb-4">
              Complétez votre profil
            </h1>
            <p className="text-gray-600">
              Ces informations nous permettront de personnaliser votre expérience et de faciliter vos commandes.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-medium text-black mb-6 flex items-center">
                <Phone className="w-5 h-5 mr-3" />
                Informations de contact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h2 className="text-xl font-medium text-black mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-3" />
                Adresse de livraison
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse ligne 1
                  </label>
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    placeholder="123 rue de la Paix"
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse ligne 2 (optionnel)
                  </label>
                  <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Appartement, étage, etc."
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      Ville
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Paris"
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Code postal
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="75001"
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Pays
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                    >
                      <option value="France">France</option>
                      <option value="Belgique">Belgique</option>
                      <option value="Suisse">Suisse</option>
                      <option value="Luxembourg">Luxembourg</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Enregistrement...' : 'Enregistrer mon profil'}
              </button>
              <button
                type="button"
                onClick={onSkip}
                disabled={isLoading}
                className="flex-1 bg-white hover:bg-gray-50 text-black border border-gray-300 font-medium py-3 px-6 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Passer cette étape
              </button>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>Vous pourrez modifier ces informations à tout moment dans votre profil.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionPage;