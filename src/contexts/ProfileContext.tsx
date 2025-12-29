import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react'
import { supabase, Profile, Customer } from '../lib/supabase'
import { useAuth } from './AuthContext'
import { User } from '../types'

type ProfileContextType = {
  // Données de profil
  user: User | null
  profile: Profile | null
  customer: Customer | null
  isProfileLoading: boolean
  isProfileComplete: boolean
  
  // Actions de profil
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>
  updateCustomerProfile: (updates: Partial<Customer>) => Promise<{ success: boolean; error?: string }>
  refreshProfile: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | null>(null)

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

export const ProfileProvider = ({ children }: PropsWithChildren) => {
  const { userId, isAuthenticated, isAuthInitialized } = useAuth()
  
  // État du profil
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  
  // Calculer si le profil est complet
  const isProfileComplete = Boolean(
    customer?.phone &&
    customer?.address_line1 &&
    customer?.city &&
    customer?.postal_code
  )

  // Fonction pour récupérer le profil utilisateur
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('👤 Fetching profile for user:', userId)
      setIsProfileLoading(true)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('👤 Error fetching profile:', error)
        return
      }

      if (data) {
        console.log('👤 Profile fetched successfully:', data.email)
        setProfile(data)
        
        // Récupérer aussi les données customer si c'est un client
        if (data.role === 'client') {
          await fetchCustomerData(data.id)
        }

        // Convertir Profile en User pour compatibilité
        const userObj: User = {
          id: data.id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          name: `${data.first_name} ${data.last_name}`,
          isLoggedIn: true
        }
        setUser(userObj)
      }
    } catch (error) {
      console.error('👤 Error in fetchUserProfile:', error)
    } finally {
      setIsProfileLoading(false)
    }
  }

  // Fonction pour récupérer les données client
  const fetchCustomerData = async (profileId: string) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('profile_id', profileId)
        .single()

      if (error) {
        console.error('👤 Error fetching customer:', error)
        return
      }

      if (data) {
        console.log('👤 Customer data fetched successfully')
        setCustomer(data)
      }
    } catch (error) {
      console.error('👤 Error in fetchCustomerData:', error)
    }
  }

  // Fonction de mise à jour du profil
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!userId) {
      return { success: false, error: 'Utilisateur non connecté' }
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)

      if (error) {
        return { success: false, error: error.message }
      }

      // Refetch profile to get updated data
      await fetchUserProfile(userId)
      return { success: true }
    } catch (error) {
      console.error('👤 Update profile error:', error)
      return { success: false, error: 'Erreur lors de la mise à jour' }
    }
  }

  // Fonction pour mapper les mises à jour camelCase vers snake_case
  const mapCustomerUpdatesToDb = (updates: any): Partial<Customer> => {
    const mapped: any = {}

    for (const [key, value] of Object.entries(updates)) {
      // Map camelCase to snake_case
      switch (key) {
        case 'addressLine1':
          mapped.address_line1 = value
          break
        case 'addressLine2':
          mapped.address_line2 = value
          break
        case 'postalCode':
          mapped.postal_code = value
          break
        case 'birthDate':
          mapped.birth_date = value
          break
        default:
          // Keep fields that are already in snake_case
          mapped[key] = value
      }
    }

    return mapped
  }

  // Fonction de mise à jour du profil client
  const updateCustomerProfile = async (updates: Partial<Customer>) => {
    if (!userId || !customer) {
      return { success: false, error: 'Données client non disponibles' }
    }

    try {
      // Convert camelCase to snake_case before sending to database
      const mappedUpdates = mapCustomerUpdatesToDb(updates)

      const { error } = await supabase
        .from('customers')
        .update(mappedUpdates)
        .eq('profile_id', userId)

      if (error) {
        return { success: false, error: error.message }
      }

      // Refetch customer data
      await fetchCustomerData(userId)
      return { success: true }
    } catch (error) {
      console.error('👤 Update customer profile error:', error)
      return { success: false, error: 'Erreur lors de la mise à jour' }
    }
  }

  // Fonction pour rafraîchir le profil
  const refreshProfile = async () => {
    if (userId) {
      await fetchUserProfile(userId)
    }
  }

  // Effet pour charger le profil quand l'utilisateur est connecté
  useEffect(() => {
    // Ne charger le profil que si l'auth est initialisée et l'utilisateur connecté
    if (isAuthInitialized && isAuthenticated && userId) {
      fetchUserProfile(userId)
    } else if (isAuthInitialized && !isAuthenticated) {
      // Nettoyer les données si l'utilisateur se déconnecte
      setUser(null)
      setProfile(null)
      setCustomer(null)
    }
  }, [userId, isAuthenticated, isAuthInitialized])

  const value: ProfileContextType = {
    user,
    profile,
    customer,
    isProfileLoading,
    isProfileComplete,
    updateProfile,
    updateCustomerProfile,
    refreshProfile
  }

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}