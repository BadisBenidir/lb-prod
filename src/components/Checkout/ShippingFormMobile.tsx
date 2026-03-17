import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, CheckCircle, Package, Home } from 'lucide-react';
import { ShippingAddress } from '../../types';
import { DeliveryType, ShippingFormResult } from './ShippingForm';
import Autocomplete from "react-google-autocomplete";

interface ShippingFormMobileProps {
  initialData: ShippingAddress;
  isUserConnected?: boolean;
  onSubmit: (result: ShippingFormResult) => void;
}

const extractComponent = (components: any[], type: string) => 
  components.find((c) => c.types.includes(type))?.long_name || '';

const ShippingFormMobile: React.FC<ShippingFormMobileProps> = ({
  initialData,
  isUserConnected = false,
  onSubmit
}) => {
  const [formData, setFormData] = useState<ShippingAddress>(initialData);
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('domicile');

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Information utilisateur connecté */}
      {isUserConnected && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Informations pré-remplies depuis votre profil
            </span>
          </div>
        </div>
      )}

      {/* Nom et Prénom */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Prénom <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Prénom"
            />
          </div>
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nom"
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
          {isUserConnected && (
            <span className="ml-2 text-xs text-blue-600 font-normal">
              (compte)
            </span>
          )}
        </label>
        <div className="relative">
          <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
            isUserConnected ? 'text-gray-500' : 'text-gray-400'
          }`} />
          {isUserConnected && (
            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          )}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            readOnly={isUserConnected}
            className={`w-full pl-10 py-3 text-sm border rounded-xl focus:outline-none ${
              isUserConnected 
                ? 'pr-10 bg-gray-50 text-gray-700 border-gray-300 cursor-not-allowed' 
                : `pr-3 focus:ring-2 focus:ring-black/20 focus:border-black ${errors.email ? 'border-red-500' : 'border-gray-300'}`
            }`}
            placeholder={isUserConnected ? '' : 'votre@email.com'}
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        {isUserConnected && (
          <p className="text-xs text-gray-600 mt-1 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
            Email verrouillé pour votre sécurité
          </p>
        )}
      </div>

      {/* Téléphone */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Téléphone <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+33 6 12 34 56 78"
          />
        </div>
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>

      {/* Adresse */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Adresse <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
      </div>

      {/* Ville et Code postal */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Ville <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Paris"
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Code postal <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black ${
              errors.postalCode ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="75001"
          />
          {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
        </div>
      </div>

      {/* Pays */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Pays <span className="text-red-500">*</span>
        </label>
        <select
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          className="w-full px-3 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black bg-white"
        >
          <option value="France">France</option>
          <option value="Belgique">Belgique</option>
          <option value="Suisse">Suisse</option>
          <option value="Luxembourg">Luxembourg</option>
          <option value="Monaco">Monaco</option>
          <option value="Monaco">Espagne</option>
          <option value="Monaco">Italie</option>
          <option value="Monaco">Allemagne</option>
        </select>
      </div>

      <div className='h-4' />

      {/* Choix du type de livraison */}
      <div className="space-y-3 mb-4 mt-6">
        <label className="block text-xs font-medium text-gray-700">
          Mode de livraison <span className="text-red-500">*</span>
        </label>

          <div className="space-y-3">
          {/* Option Point Relais */}
          <button
            type="button"
            disabled
            onClick={() => setDeliveryType('point_relais')}
            className={`w-full flex items-center opacity-50 justify-between p-3 border-2 rounded-xl transition-all ${
              deliveryType === 'point_relais'
                ? 'border-black bg-gray-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center">
              <Package className={`h-5 w-5 mr-3 ${deliveryType === 'point_relais' ? 'text-black' : 'text-gray-400'}`} />
              <div className="text-left">
                <span className={`font-medium text-sm ${deliveryType === 'point_relais' ? 'text-black' : 'text-gray-700'}`}>
                  Point Relais
                </span>
                <p className="text-xs text-gray-500">Le plus proche de votre adresse</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="font-bold text-sm mr-2">9,99 €</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                deliveryType === 'point_relais' ? 'border-black' : 'border-gray-300'
              }`}>
                {deliveryType === 'point_relais' && (
                  <div className="w-3 h-3 rounded-full bg-black" />
                )}
              </div>
            </div>
          </button>

          {/* Option Adresse spécifique */}
          <button
            type="button"
            onClick={() => setDeliveryType('domicile')}
            className={`w-full flex items-center justify-between p-3 border-2 rounded-xl transition-all ${
              deliveryType === 'domicile'
                ? 'border-black bg-gray-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center">
              <Home className={`h-5 w-5 mr-3 ${deliveryType === 'domicile' ? 'text-black' : 'text-gray-400'}`} />
              <div className="text-left">
                <span className={`font-medium text-sm ${deliveryType === 'domicile' ? 'text-black' : 'text-gray-700'}`}>
                  À une adresse
                </span>
                <p className="text-xs text-gray-500">Domicile, bureau, etc.</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="font-bold text-sm mr-2">0.50 €</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                deliveryType === 'domicile' ? 'border-black' : 'border-gray-300'
              }`}>
                {deliveryType === 'domicile' && (
                  <div className="w-3 h-3 rounded-full bg-black" />
                )}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors mt-6"
      >
        Continuer vers le paiement
      </button>
    </form>
  );
};

export default ShippingFormMobile;