import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Package, Home } from 'lucide-react';
import { ShippingAddress } from '../../types';
import Autocomplete from "react-google-autocomplete";

export type DeliveryType = 'point_relais' | 'domicile';

export interface ShippingFormResult {
  address: ShippingAddress;
  deliveryType: DeliveryType;
}

interface ShippingFormProps {
  initialData: ShippingAddress;
  isUserConnected?: boolean;
  onSubmit: (result: ShippingFormResult) => void;
  onDeliveryTypeChange?: (type: DeliveryType) => void;
}

const extractComponent = (components: any[], type: string) => 
  components.find((c) => c.types.includes(type))?.long_name || '';

const ShippingForm: React.FC<ShippingFormProps> = ({ initialData, isUserConnected = false, onSubmit, onDeliveryTypeChange }) => {
  const [formData, setFormData] = useState<ShippingAddress>(initialData);
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('domicile');

  React.useEffect(() => {
    if (onDeliveryTypeChange) {
      onDeliveryTypeChange(deliveryType);
    }
  }, [deliveryType, onDeliveryTypeChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ShippingAddress]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<ShippingAddress> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis';
    if (!formData.email.trim()) newErrors.email = 'Email requis';
    if (!formData.phone.trim()) newErrors.phone = 'Téléphone requis';
    if (!formData.address.trim()) newErrors.address = 'Adresse requise';
    if (!formData.city.trim()) newErrors.city = 'Ville requise';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Code postal requis';
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ address: formData, deliveryType });
    }
  };

  console.log("GMAPS KEY =", import.meta.env.VITE_GOOGLE_MAPS_KEY);

  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-6">Adresse de livraison</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields */}
        <label className="block text-sm font-medium text-gray-700 mb-3">
            Informations de Livraison <span className="text-red-500">*</span>
          </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prénom <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border focus:outline-none focus:border-black ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Prénom"
              />
            </div>
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border focus:outline-none focus:border-black ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nom"
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>
        </div>

        {/* Contact Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
              {isUserConnected && (
                <span className="ml-2 text-xs text-blue-600 font-normal">
                  (adresse de votre compte)
                </span>
              )}
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isUserConnected ? 'text-gray-500' : 'text-gray-400'
              }`} />
              {isUserConnected && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                readOnly={isUserConnected}
                className={`w-full pl-10 py-3 border focus:outline-none ${
                  isUserConnected 
                    ? 'pr-10 bg-gray-50 text-gray-700 border-gray-300 cursor-not-allowed' 
                    : `pr-4 focus:border-black ${errors.email ? 'border-red-500' : 'border-gray-300'}`
                }`}
                placeholder={isUserConnected ? '' : 'votre@email.com'}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            {isUserConnected && (
              <p className="text-xs text-gray-600 mt-1 flex items-center">
                <svg className="w-3 h-3 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Email verrouillé pour votre sécurité
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border focus:outline-none focus:border-black ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+33 6 12 34 56 78"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
        </div>


        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Autocomplete
              apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY} // ou process.env... selon ton build
              defaultValue={formData.address}
              onChange={(e: any) => {
                const value = e.target.value;
                setFormData((prev) => ({ ...prev, address: value }));
              }}
              onPlaceSelected={(place: any) => {
                const components = place.address_components || [];

                const city =
                  extractComponent(components, "locality") ||
                  extractComponent(components, "postal_town") ||
                  extractComponent(components, "administrative_area_level_2");

                setFormData((prev) => ({
                  ...prev,
                  address: place.formatted_address || "",
                  city,
                  postalCode: extractComponent(components, "postal_code"),
                }));
              }}
              options={{
                types: ["address"],
                componentRestrictions: { country: "fr" },
              }}
              className={`w-full pl-10 pr-4 py-3 border focus:outline-none focus:border-black ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        {/* City and Postal Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ville <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border focus:outline-none focus:border-black ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Paris"
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code postal <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border focus:outline-none focus:border-black ${
                errors.postalCode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="75001"
            />
            {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pays <span className="text-red-500">*</span>
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
          >
            <option value="France">France</option>
            <option value="Belgique">Belgique</option>
            <option value="Suisse">Suisse</option>
            <option value="Luxembourg">Luxembourg</option>
            <option value="Monaco">Monaco</option>
          </select>
        </div>

        {/* Choix du type de livraison */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Mode de livraison <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option Point Relais */}
            <button
              type="button"
              disabled
              onClick={() => setDeliveryType('point_relais')}
              className={`relative flex flex-col opacity-50 cursor-not-allowed p-4 border-2 rounded-lg transition-all ${
                deliveryType === 'point_relais'
                  ? 'border-black bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Package className={`h-5 w-5 mr-2 ${deliveryType === 'point_relais' ? 'text-black' : 'text-gray-400'}`} />
                  <span className={`font-medium ${deliveryType === 'point_relais' ? 'text-black' : 'text-gray-700'}`}>
                    Point Relais
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  deliveryType === 'point_relais' ? 'border-black' : 'border-gray-300'
                }`}>
                  {deliveryType === 'point_relais' && (
                    <div className="w-3 h-3 rounded-full bg-black" />
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 text-left">
                Livraison au point relais le plus proche de votre adresse
              </p>
              <div className="mt-2 text-lg font-bold text-black">
                9,99 €
              </div>
            </button>

            {/* Option Adresse spécifique */}
            <button
              type="button"
              onClick={() => setDeliveryType('domicile')}
              className={`relative flex flex-col p-4 border-2 rounded-lg transition-all ${
                deliveryType === 'domicile'
                  ? 'border-black bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Home className={`h-5 w-5 mr-2 ${deliveryType === 'domicile' ? 'text-black' : 'text-gray-400'}`} />
                  <span className={`font-medium ${deliveryType === 'domicile' ? 'text-black' : 'text-gray-700'}`}>
                    À une adresse
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  deliveryType === 'domicile' ? 'border-black' : 'border-gray-300'
                }`}>
                  {deliveryType === 'domicile' && (
                    <div className="w-3 h-3 rounded-full bg-black" />
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 text-left">
                Livraison à l'adresse indiquée (domicile, bureau, etc.)
              </p>
              <div className="mt-2 text-lg font-bold text-black">
                14,99 €
              </div>
            </button>
          </div>

          {deliveryType === 'point_relais' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
              <p className="text-sm text-blue-700">
                <strong>Note :</strong> Le point relais Chronopost le plus proche de votre adresse sera automatiquement sélectionné. Vous recevrez les détails par email.
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors"
        >
          Continuer vers le paiement
        </button>
      </form>
    </div>
  );
};

export default ShippingForm;