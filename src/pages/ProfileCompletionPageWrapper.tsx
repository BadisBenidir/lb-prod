import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileCompletionPage } from './ProfileCompletionPage';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { supabase } from '../lib/supabase';

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

  const handleComplete = async (data: ProfileCompletionData) => {
    setIsLoading(true);
    try {
      // 1. On récupère l'ID de l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non trouvé");

      // 2. On envoie les données à la table 'profiles' (PAS 'customers')
      const { error } = await supabase
        .from('customers') 
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          address: data.address_line1, // <-- Vérifie si c'est 'address' dans ta table
          city: data.city,
          zip_code: data.postal_code,  // <-- Vérifie si c'est 'zip_code' ou 'postal_code'
          phone: data.phone
        })
        .eq('id', user.id); // On utilise l'ID de l'utilisateur

      if (error) throw error;

      // 3. Si ça a marché, on redirige comme pour le bouton "Passer"
      navigate('/'); 
      return { success: true };
    } catch (err: any) {
      console.error("Erreur de sauvegarde:", err.message);
      alert("Erreur : " + err.message);
      return { success: false, error: err.message };
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
