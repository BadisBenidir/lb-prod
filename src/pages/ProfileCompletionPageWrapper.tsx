import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Un seul ../
import { supabase } from '../lib/supabase'; // Un seul ../
import { ProfileCompletionPage } from './ProfileCompletionPage'; // Avec des { }
import { ProfileCompletionData } from '../types/profile';

const ProfileCompletionPageWrapper: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async (data: ProfileCompletionData) => {
    if (!user) return;
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('customers')
        .upsert({
          profile_id: user.id,
          address_line1: data.addressLine1 || null,
          address_line2: data.addressLine2 || null,
          city: data.city || null,
          postal_code: data.postalCode || null,
          phone: data.phone || null,
          birth_date: data.birthDate === "" ? null : data.birthDate
        }, { onConflict: 'profile_id' });

      if (error) throw error;
      navigate('/'); 
    } catch (err: any) {
      alert("Erreur de sauvegarde : " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleskip = () => navigate('/');

  return (
    <ProfileCompletionPage 
      onComplete={handleComplete}
      onSkip={handleskip}
      isLoading={isLoading}
    />
  );
};

export default ProfileCompletionPageWrapper;