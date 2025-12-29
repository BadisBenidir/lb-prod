import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Package, Heart, Settings, LogOut, Edit2, Save, X } from 'lucide-react';
import { User as UserType } from '../../types';
import { Customer } from '../../lib/supabase';
import UserOrdersWrapper from './UserOrdersWrapper';
import FavoritesList from './FavoritesList';

interface ProfilePageMobileProps {
  user: UserType;
  customer: Customer | null;
  onUpdateCustomerProfile: (customerData: any) => Promise<{ success: boolean; error?: string }>;
  onLogout: () => void;
  onCompleteProfile?: () => void;
  isLoading: boolean;
}

const ProfilePageMobile: React.FC<ProfilePageMobileProps> = ({
  user,
  customer,
  onUpdateCustomerProfile,
  onLogout,
  onCompleteProfile,
  isLoading
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: customer?.phone || '',
    birthDate: customer?.birth_date || '',
    addressLine1: customer?.address_line1 || '',
    addressLine2: customer?.address_line2 || '',
    city: customer?.city || '',
    postalCode: customer?.postal_code || '',
    country: customer?.country || 'France'
  });
  const [updateMessage, setUpdateMessage] = useState('');

  const handleSave = async () => {
    try {
      const customerResult = await onUpdateCustomerProfile({
        phone: editData.phone,
        birthDate: customer?.birth_date || '',
        addressLine1: editData.addressLine1,
        addressLine2: editData.addressLine2,
        city: editData.city,
        postalCode: editData.postalCode,
        country: editData.country
      });

      if (customerResult.success) {
        setIsEditing(false);
        setUpdateMessage('Profil mis à jour avec succès');
        setTimeout(() => setUpdateMessage(''), 3000);
      } else {
        setUpdateMessage(`Erreur: ${customerResult.error}`);
      }
    } catch {
      setUpdateMessage('Erreur lors de la sauvegarde');
    }
  };

  const handleCancel = () => {
    setEditData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: customer?.phone || '',
      birthDate: customer?.birth_date || '',
      addressLine1: customer?.address_line1 || '',
      addressLine2: customer?.address_line2 || '',
      city: customer?.city || '',
      postalCode: customer?.postal_code || '',
      country: customer?.country || 'France'
    });
    setIsEditing(false);
  };

  const tabs = [
    { id: 'profile', label: 'Mon Profil', icon: User },
    { id: 'orders', label: 'Mes Commandes', icon: Package },
    { id: 'favorites', label: 'Mes Favoris', icon: Heart },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const isProfileIncomplete = !!onCompleteProfile;

  return (
    <div className="min-h-screen bg-white">
      <div className="px-3 py-4">
        {/* Header Mobile */}
        <div className="bg-white border border-gray-200 p-3 mb-4 rounded-lg">
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 flex items-center justify-center mr-3 rounded-full">
                <User className="h-6 w-6 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-semibold text-black truncate">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-sm text-gray-600 truncate">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Code : <span className="font-mono font-medium text-black">
                    {customer?.customer_code || 'N/A'}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center px-3 py-2 text-sm text-gray-600 hover:text-red-600 border border-gray-300 hover:border-red-300 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </button>
          </div>
        </div>

        {/* Bandeau profil incomplet Mobile */}
        {isProfileIncomplete && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <div className="space-y-3">
              <div className="flex items-start">
                <svg className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="flex-1">
                  <p className="font-medium text-amber-800 text-sm">
                    Profil incomplet
                  </p>
                  <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                    Complétez vos informations pour une meilleure expérience.
                  </p>
                </div>
              </div>
              <button
                onClick={onCompleteProfile}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 text-sm font-medium rounded-lg transition-colors"
              >
                Compléter
              </button>
            </div>
          </div>
        )}

        {/* Navigation Mobile */}
        <div className="bg-white border border-gray-200 rounded-lg mb-4">
          <nav className="grid grid-cols-2 gap-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center px-2 py-3 text-xs font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'text-black border-black bg-gray-50'
                      : 'text-gray-600 border-transparent'
                  }`}
                >
                  <Icon className="h-4 w-4 mb-1" />
                  <span className="truncate text-center">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenu Mobile */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          {/* Success Message */}
          {updateMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{updateMessage}</p>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Mon Profil</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-3 py-1 text-sm text-black hover:text-gray-600"
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Modifier
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex items-center px-3 py-1 bg-black text-white text-sm hover:bg-gray-800 rounded disabled:opacity-50"
                    >
                      <Save className="h-3 w-3 mr-1" />
                      OK
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-3 py-1 text-sm text-gray-600"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Annuler
                    </button>
                  </div>
                )}
              </div>

              {/* Informations de base - Mobile */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-black flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Informations de base
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Prénom <span className="text-xs text-gray-500">(protégé)</span>
                    </label>
                    <p className="px-3 py-2 bg-gray-100 text-gray-600 border border-gray-200 rounded text-sm">
                      {user.firstName}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nom <span className="text-xs text-gray-500">(protégé)</span>
                    </label>
                    <p className="px-3 py-2 bg-gray-100 text-gray-600 border border-gray-200 rounded text-sm">
                      {user.lastName}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email <span className="text-xs text-gray-500">(protégé)</span>
                    </label>
                    <p className="px-3 py-2 bg-gray-100 text-gray-600 border border-gray-200 rounded text-sm break-all">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact - Mobile */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-black flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact
                </h3>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Téléphone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+33 6 12 34 56 78"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black rounded text-sm"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded text-sm">{customer?.phone || 'Non renseigné'}</p>
                  )}
                </div>
              </div>

              {/* Adresse - Mobile */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-black flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Adresse
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Adresse</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.addressLine1}
                        onChange={(e) => setEditData(prev => ({ ...prev, addressLine1: e.target.value }))}
                        placeholder="123 rue de la Paix"
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black rounded text-sm"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded text-sm">{customer?.address_line1 || 'Non renseignée'}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Ville</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.city}
                          onChange={(e) => setEditData(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="Paris"
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black rounded text-sm"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded text-sm">{customer?.city || 'Non renseignée'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Code postal</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.postalCode}
                          onChange={(e) => setEditData(prev => ({ ...prev, postalCode: e.target.value }))}
                          placeholder="75001"
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black rounded text-sm"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded text-sm">{customer?.postal_code || 'Non renseigné'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <UserOrdersWrapper 
              userId={user.id} 
              email={user.email} 
            />
          )}

          {activeTab === 'favorites' && (
            <FavoritesList 
              userId={user.id} 
              onProductClick={(productId) => {
                navigate(`/produit/${productId}`);
              }}
            />
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Paramètres</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-black focus:ring-black border-gray-300" />
                      <span className="ml-3 text-sm text-gray-700">Newsletters</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-black focus:ring-black border-gray-300" />
                      <span className="ml-3 text-sm text-gray-700">Nouvelles collections</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePageMobile;