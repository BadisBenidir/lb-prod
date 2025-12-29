import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Package, Heart, Settings, LogOut, Edit2, Save, X } from 'lucide-react';
import { User as UserType } from '../../types';
import { Customer } from '../../lib/supabase';
import UserOrdersWrapper from './UserOrdersWrapper';
import FavoritesList from './FavoritesList';

interface ProfilePageDesktopProps {
  user: UserType;
  customer: Customer | null;
  onUpdateCustomerProfile: (customerData: any) => Promise<{ success: boolean; error?: string }>;
  onLogout: () => void;
  onCompleteProfile?: () => void;
  isLoading: boolean;
}

const ProfilePageDesktop: React.FC<ProfilePageDesktopProps> = ({ user, customer, onUpdateCustomerProfile, onLogout, onCompleteProfile, isLoading }) => {
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mr-4">
                <User className="h-8 w-8 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-light text-black">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Code client : <span className="font-mono font-medium text-black">
                    {customer?.customer_code || 'Non attribué'}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </button>
          </div>
        </div>

        {/* Bandeau profil incomplet */}
        {isProfileIncomplete && (
          <div className="bg-amber-50 border border-amber-200 p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="font-medium text-amber-800">
                    Votre profil n'est pas complet
                  </p>
                  <p className="text-amber-700 text-sm">
                    Complétez vos informations personnelles et d'adresse pour faciliter vos commandes et recevoir des recommandations personnalisées.
                  </p>
                </div>
              </div>
              <button
                onClick={onCompleteProfile}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 font-medium transition duration-200 whitespace-nowrap ml-4"
              >
                Compléter mon profil
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gray-100 text-black border-l-4 border-black'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 p-6">
              {/* Success Message */}
              {updateMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm">{updateMessage}</p>
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Informations personnelles</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-4 py-2 text-black hover:text-gray-600 transition-colors"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Modifier
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          disabled={isLoading}
                          className="flex items-center px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Sauvegarder
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Annuler
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Message informatif */}
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-sm">
                        <p className="font-medium text-blue-800 mb-1">
                          Modification des informations personnelles
                        </p>
                        <p className="text-blue-700">
                          Pour des raisons de sécurité, certaines informations (nom, prénom, email, date de naissance) ne peuvent pas être modifiées directement. 
                          Pour toute modification de ces données, veuillez nous contacter par email à{' '}
                          <a href="mailto:support@ligneblanche.fr" className="font-medium underline hover:no-underline">
                            support@ligneblanche.fr
                          </a>{' '}
                          en justifiant votre demande.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informations de base */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-black mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Informations de base
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom
                          <span className="text-xs text-gray-500 ml-2">(non modifiable)</span>
                        </label>
                        <p className="px-4 py-3 bg-gray-100 text-gray-600 border border-gray-200">
                          {user.firstName}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom
                          <span className="text-xs text-gray-500 ml-2">(non modifiable)</span>
                        </label>
                        <p className="px-4 py-3 bg-gray-100 text-gray-600 border border-gray-200">
                          {user.lastName}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                          <span className="text-xs text-gray-500 ml-2">(non modifiable)</span>
                        </label>
                        <p className="px-4 py-3 bg-gray-100 text-gray-600 border border-gray-200">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informations de contact */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-black mb-4 flex items-center">
                      <Phone className="w-5 h-5 mr-2" />
                      Informations de contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editData.phone}
                            onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+33 6 12 34 56 78"
                            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50">{customer?.phone || 'Non renseigné'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date de naissance
                          <span className="text-xs text-gray-500 ml-2">(non modifiable)</span>
                        </label>
                        <p className="px-4 py-3 bg-gray-100 text-gray-600 border border-gray-200">
                          {customer?.birth_date ? new Date(customer.birth_date).toLocaleDateString('fr-FR') : 'Non renseignée'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Adresse de livraison */}
                  <div>
                    <h3 className="text-lg font-medium text-black mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Adresse de livraison
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Adresse ligne 1</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.addressLine1}
                            onChange={(e) => setEditData(prev => ({ ...prev, addressLine1: e.target.value }))}
                            placeholder="123 rue de la Paix"
                            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50">{customer?.address_line1 || 'Non renseignée'}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Adresse ligne 2 (optionnel)</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.addressLine2}
                            onChange={(e) => setEditData(prev => ({ ...prev, addressLine2: e.target.value }))}
                            placeholder="Appartement, étage, etc."
                            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50">{customer?.address_line2 || 'Non renseignée'}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.city}
                              onChange={(e) => setEditData(prev => ({ ...prev, city: e.target.value }))}
                              placeholder="Paris"
                              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50">{customer?.city || 'Non renseignée'}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.postalCode}
                              onChange={(e) => setEditData(prev => ({ ...prev, postalCode: e.target.value }))}
                              placeholder="75001"
                              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-gray-50">{customer?.postal_code || 'Non renseigné'}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                          {isEditing ? (
                            <select
                              value={editData.country}
                              onChange={(e) => setEditData(prev => ({ ...prev, country: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                            >
                              <option value="France">France</option>
                              <option value="Belgique">Belgique</option>
                              <option value="Suisse">Suisse</option>
                              <option value="Luxembourg">Luxembourg</option>
                            </select>
                          ) : (
                            <p className="px-4 py-3 bg-gray-50">{customer?.country || 'France'}</p>
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
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Paramètres</h2>
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                      <div className="space-y-4">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="h-4 w-4 text-black focus:ring-black border-gray-300" />
                          <span className="ml-3 text-gray-700">Recevoir les newsletters</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="h-4 w-4 text-black focus:ring-black border-gray-300" />
                          <span className="ml-3 text-gray-700">Notifications de nouvelles collections</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-black focus:ring-black border-gray-300" />
                          <span className="ml-3 text-gray-700">Offres promotionnelles</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Sécurité</h3>
                      <button className="text-black hover:text-gray-600 font-medium">
                        Changer le mot de passe
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageDesktop;