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
      const handleComplete = async (data: ProfileCompletionData) => {
        setIsLoading(true);
        
        // 1. On nettoie les données (on transforme les "" en null)
        const cleanData = {
          profile_id: user.id,
          address_line1: data.addressLine1 || null,
          address_line2: data.addressLine2 || null,
          city: data.city || null,
          postal_code: data.postalCode || null,
          phone: data.phone || null,
          // FIX CRITIQUE : Si la date est vide, on envoie null, pas ""
          birth_date: data.birthDate === "" ? null : data.birthDate
        };

        // 2. On utilise UPSERT (pour Créer OU Modifier)
        const { error } = await supabase
          .from('customers')
          .upsert(cleanData, { onConflict: 'profile_id' });

        if (error) {
          console.error("Erreur de sauvegarde :", error.message);
          alert("Erreur Supabase : " + error.message);
        } else {
          // 3. On ne redirige que SI ça a marché !
          navigate('/');
        }
        
        setIsLoading(false);
      };

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
