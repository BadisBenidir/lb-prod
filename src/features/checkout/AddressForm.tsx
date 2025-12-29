import React, { useState } from 'react';
import { ShippingAddress } from '../../types';

interface AddressFormProps {
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  sameAsShipping: boolean;
  onSameAsShippingChange: (checked: boolean) => void;
  onSubmit: (address: ShippingAddress, isBilling?: boolean) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  shippingAddress,
  billingAddress,
  sameAsShipping,
  onSameAsShippingChange,
  onSubmit
}) => {
  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const [shippingForm, setShippingForm] = useState<ShippingAddress>(shippingAddress);
  const [billingForm, setBillingForm] = useState<ShippingAddress>(billingAddress);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(shippingForm);
  };

  const handleBillingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(billingForm, true);
    setIsEditingBilling(false);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleShippingSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Prénom *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={shippingForm.firstName}
              onChange={handleShippingChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:border-gray-400"
              placeholder="Votre prénom"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Nom *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={shippingForm.lastName}
              onChange={handleShippingChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:border-gray-400"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={shippingForm.email}
            onChange={handleShippingChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={shippingForm.phone}
            onChange={handleShippingChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Adresse *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={shippingForm.address}
            onChange={handleShippingChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
              Code postal *
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={shippingForm.postalCode}
              onChange={handleShippingChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:border-gray-400"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              Ville *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={shippingForm.city}
              onChange={handleShippingChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:border-gray-400"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Pays *
          </label>
          <select
            id="country"
            name="country"
            value={shippingForm.country}
            onChange={(e) => setShippingForm(prev => ({ ...prev, country: e.target.value }))}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
          >
            <option value="France">France</option>
            <option value="Belgique">Belgique</option>
            <option value="Suisse">Suisse</option>
            <option value="Canada">Canada</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
        
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            id="sameAsShipping"
            checked={sameAsShipping}
            onChange={(e) => onSameAsShippingChange(e.target.checked)}
            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
          />
          <label htmlFor="sameAsShipping" className="ml-2 block text-sm text-gray-700">
            Utiliser cette adresse comme adresse de facturation
          </label>
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-black text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 btn-checkout"
          >
            <div className="flex items-center justify-center">
              <span>Continuer vers le paiement</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;