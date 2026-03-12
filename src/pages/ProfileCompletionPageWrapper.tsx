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

const ProfileCompletionPageWrapper: React.FC<{}> = () => {
  const navigate = useNavigate();
  // ON AJOUTE 'user' ICI POUR POUVOIR UTILISER user.id
  const { user, isAuthenticated, isAuthInitialized } = useAuth(); 
  const { updateCustomerProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async (data: ProfileCompletionData) => {
    setIsLoading(true);
    
    // 1. On prépare les données (on transforme les "" en null)
    const cleanData = {
      profile_id: user?.id, // On utilise l'ID de l'utilisateur connecté
      address_line1: data.addressLine1 || null,
      address_line2: data.addressLine2 || null,
      city: data.city || null,
      postal_code: data.postalCode || null,
      phone: data.phone || null,
      birth_date: data.birthDate === "" ? null : data.birthDate
    };

    // 2. On utilise UPSERT (pour Créer OU Modifier) dans la table 'customers'
    const { error } = await supabase
      .from('customers')
      .upsert(cleanData, { onConflict: 'profile_id' });

    if (error) {
      console.error("Erreur de sauvegarde :", error.message);
      alert("Erreur Supabase : " + error.message);
    } else {
      // 3. On redirige vers l'accueil
      navigate('/');
    }
    
    setIsLoading(false);
  };
  
  const handleskip = () => {
    navigate('/');
  };

  return (
    <ProfileCompletionPage 
      onComplete={handleComplete}
      onSkip={handleskip}
      isLoading={isLoading}
    />
  );
}; // <--- C'EST LA FIN DU WRAPPER

export default ProfileCompletionPageWrapper;