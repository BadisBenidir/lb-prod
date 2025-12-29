import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileCompletionPage } from './ProfileCompletionPage';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';

interface ProfileCompletionData {
  phone: string;
  birthDate: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  country: string;
}

const ProfileCompletionPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAuthInitialized } = useAuth();
  const { updateCustomerProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async (data: ProfileCompletionData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // Appeler updateCustomerProfile avec les données du formulaire
      const result = await updateCustomerProfile({
        phone: data.phone,
        birth_date: data.birthDate,
        address_line1: data.addressLine1,
        address_line2: data.addressLine2,
        city: data.city,
        postal_code: data.postalCode,
        country: data.country
      });

      if (result.success) {
        // Rediriger vers la page de profil après succès
        navigate('/profil');
      }

      return result;
    } catch (error) {
      console.error('Error completing profile:', error);
      return {
        success: false,
        error: 'Une erreur est survenue lors de la sauvegarde'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Rediriger vers la page d'accueil si l'utilisateur passe l'étape
    navigate('/');
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

  return (
    <ProfileCompletionPage
      onComplete={handleComplete}
      onSkip={handleSkip}
      isLoading={isLoading}
    />
  );
};

export default ProfileCompletionPageWrapper;
