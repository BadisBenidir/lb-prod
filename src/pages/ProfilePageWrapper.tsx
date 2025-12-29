import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfilePage from '../components/Profile/ProfilePage';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';

const ProfilePageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated, isAuthInitialized } = useAuth();
  const { 
    user, 
    customer, 
    updateProfile, 
    updateCustomerProfile, 
    isProfileLoading,
    isProfileComplete
  } = useProfile();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleCompleteProfile = () => {
    navigate('/profil/completion');
  };

  // Attendre que l'auth soit initialisée
  if (!isAuthInitialized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-gray-600 mb-4">Initialisation...</div>
        </div>
      </div>
    );
  }

  // Rediriger si non authentifié
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Afficher un loading si le profil est en cours de chargement OU si user n'est pas encore chargé
  if (isProfileLoading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-gray-600 mb-4">Chargement du profil...</div>
          <div className="text-xs text-gray-400 mt-2">
            Loading: {isProfileLoading ? '⏳' : '✓'} | User: {user ? '✓' : '⏳'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProfilePage
      user={user}
      customer={customer}
      onUpdateCustomerProfile={updateCustomerProfile}
      onLogout={handleLogout}
      onCompleteProfile={!isProfileComplete ? handleCompleteProfile : undefined}
      isLoading={isProfileLoading}
    />
  );
};

export default ProfilePageWrapper;