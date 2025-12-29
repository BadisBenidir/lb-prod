import { useState, useEffect } from 'react';
import { User } from '../types';
import { supabase, Profile, Customer } from '../lib/supabase';
import type { AuthError, User as SupabaseUser } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error('Auth error:', authError);
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        console.log('Login successful, fetching profile for user:', authData.user.id);
        await fetchUserProfile(authData.user.id);
        console.log('Profile fetched successfully');
      }

      console.log('Login process completed successfully');
      return { success: true };
    } catch (error) {
      console.error('Login catch error:', error);
      return { success: false, error: 'Erreur de connexion' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
    newsletter: boolean;
  }) => {
    setIsLoading(true);
    try {
      // Validations côté client
      if (userData.password !== userData.confirmPassword) {
        return { success: false, error: 'Les mots de passe ne correspondent pas' };
      }
      
      if (!userData.acceptTerms) {
        return { success: false, error: 'Vous devez accepter les conditions générales' };
      }

      if (userData.password.length < 6) {
        return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' };
      }

      // Inscription Supabase avec métadonnées
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            newsletter: userData.newsletter
          }
        }
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        // Le trigger SQL créera automatiquement le profil + customer
        await fetchUserProfile(authData.user.id);

        // Mettre à jour les données customer (téléphone + newsletter)
        if (userData.phone || userData.newsletter) {
          const { error: updateError } = await supabase
            .from('customers')
            .update({
              phone: userData.phone || null,
              newsletter: userData.newsletter
            })
            .eq('profile_id', authData.user.id);

          if (updateError) {
            console.error('Error updating customer data:', updateError);
            // Ne pas échouer l'inscription pour ça
          }
        }
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erreur lors de la création du compte' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error during logout:', error);
        // Même en cas d'erreur, on nettoie l'état local
      }
      
      // Nettoyer tous les états
      setUser(null);
      setProfile(null);
      setCustomer(null);
      
    } catch (error) {
      console.error('Error in logout function:', error);
      // Nettoyer l'état même en cas d'erreur
      setUser(null);
      setProfile(null);
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<Profile>) => {
    setIsLoading(true);
    try {
      if (!user?.id) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      if (data) {
        setProfile(data);
        // Mettre à jour aussi l'objet User local
        setUser({
          ...user,
          firstName: data.first_name,
          lastName: data.last_name,
          name: `${data.first_name} ${data.last_name}`,
          email: data.email
        });
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erreur lors de la mise à jour' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateCustomerProfile = async (customerData: {
    phone: string;
    birthDate: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    postalCode: string;
    country: string;
  }) => {
    if (!user || !profile) return { success: false, error: 'Aucun utilisateur connecté' };
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .update({
          phone: customerData.phone || null,
          birth_date: customerData.birthDate || null,
          address_line1: customerData.addressLine1 || null,
          address_line2: customerData.addressLine2 || null,
          city: customerData.city || null,
          postal_code: customerData.postalCode || null,
          country: customerData.country,
          updated_at: new Date().toISOString()
        })
        .eq('profile_id', profile.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      if (data) {
        setCustomer(data);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erreur lors de la mise à jour du profil' };
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer les données customer depuis Supabase
  const fetchCustomerData = async (profileId: string) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('profile_id', profileId)
        .single();

      if (error) {
        console.error('Error fetching customer:', error);
        return null;
      }

      if (data) {
        setCustomer(data);
        return data;
      }
    } catch (error) {
      console.error('Error in fetchCustomerData:', error);
      return null;
    }
  };

  // Récupérer le profil utilisateur depuis Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
        
        // Récupérer aussi les données customer si c'est un client
        if (data.role === 'client') {
          await fetchCustomerData(data.id);
        }

        // Convertir Profile en User pour compatibilité
        const userObj: User = {
          id: data.id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          name: `${data.first_name} ${data.last_name}`,
          isLoggedIn: true
        };
        setUser(userObj);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  // Vérifier le statut d'authentification au chargement
  const checkAuthStatus = async () => {
    if (isInitialized) return; // Éviter les appels multiples
    
    try {
      setIsLoading(true);
      console.log('Starting checkAuthStatus...');
      
      // Utiliser refreshSession pour forcer le rafraîchissement si nécessaire
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking auth status:', error);
        // Tentative de refresh si l'erreur semble liée à un token expiré
        if (error.message.includes('refresh_token_not_found') || error.message.includes('invalid')) {
          await supabase.auth.signOut();
        }
        setUser(null);
        setProfile(null);
        return;
      }

      if (session?.user) {
        // Vérification plus robuste de la validité de la session
        const now = Math.round(Date.now() / 1000);
        const expiresAt = session.expires_at || 0;
        
        // Si la session expire dans moins de 5 minutes, la rafraîchir proactivement
        if (expiresAt > 0 && (expiresAt - now) < 300) {
          console.log('Session proche de l\'expiration, rafraîchissement...');
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            console.error('Error refreshing session:', refreshError);
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            return;
          }
          
          if (refreshData.session?.user) {
            await fetchUserProfile(refreshData.session.user.id);
          }
        } else {
          await fetchUserProfile(session.user.id);
        }
      } else {
        console.log('No session found, cleaning state');
        setUser(null);
        setProfile(null);
        setCustomer(null);
      }
    } catch (error) {
      console.error('Error in checkAuthStatus:', error);
      setUser(null);
      setProfile(null);
      setCustomer(null);
    } finally {
      console.log('checkAuthStatus completed, setting loading to false');
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  // Écouter les changements d'authentification
  useEffect(() => {
    // Vérifier le statut initial
    checkAuthStatus();

    // Écouter les changements d'auth avec gestion d'erreur améliorée
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.expires_at ? new Date(session.expires_at * 1000) : null);
        
        // Ne pas traiter les événements pendant l'initialisation
        if (!isInitialized && event !== 'INITIAL_SESSION') return;
        
        try {
          setIsLoading(true);
          
          switch (event) {
            case 'SIGNED_IN':
              if (session?.user) {
                await fetchUserProfile(session.user.id);
              }
              break;
              
            case 'SIGNED_OUT':
              setUser(null);
              setProfile(null);
              setCustomer(null);
              break;
              
            case 'TOKEN_REFRESHED':
              if (session?.user) {
                console.log('Token refreshed successfully');
                await fetchUserProfile(session.user.id);
              } else {
                // Refresh token expiré, déconnecter
                console.log('Refresh token expired, signing out');
                setUser(null);
                setProfile(null);
                setCustomer(null);
              }
              break;
              
            case 'PASSWORD_RECOVERY':
            case 'USER_UPDATED':
              // Ré-synchroniser le profil
              if (session?.user) {
                await fetchUserProfile(session.user.id);
              }
              break;
              
            default:
              // Gérer les autres événements si nécessaire
              break;
          }
        } catch (error) {
          console.error('Error handling auth state change:', error);
          // En cas d'erreur, nettoyer l'état pour éviter les états incohérents
          setUser(null);
          setProfile(null);
          setCustomer(null);
        } finally {
          console.log('Auth state change completed, setting loading to false');
          setIsLoading(false);
        }
      }
    );

    // Nettoyer l'abonnement au démontage
    return () => {
      subscription.unsubscribe();
    };
  }, [isInitialized]);

  // Évaluer si le profil est complet
  const isProfileComplete = () => {
    if (!customer || !profile) return false;
    
    // Un profil est considéré comme complet si :
    // - Téléphone renseigné
    // - Au moins l'adresse ligne 1 et la ville renseignées
    return !!(
      customer.phone && 
      customer.address_line1 && 
      customer.city
    );
  };

  return {
    user,
    profile,
    customer,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    updateCustomerProfile,
    checkAuthStatus,
    isLoggedIn: !!user,
    isProfileComplete: isProfileComplete()
  };
};