import React, { useState, useEffect, createContext, useContext, PropsWithChildren } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type AuthContextType = {
  // Session Supabase uniquement
  session: Session | null
  userId: string | null
  userEmail: string | null
  isAuthenticated: boolean
  isAuthLoading: boolean
  isAuthInitialized: boolean
  
  // Actions d'authentification
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>
  register: (userData: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    password: string
    confirmPassword: string
    acceptTerms: boolean
    newsletter: boolean
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  // État d'authentification simplifié - SESSION UNIQUEMENT
  const [session, setSession] = useState<Session | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(false)
  const [isAuthInitialized, setIsAuthInitialized] = useState(false)
  
  // Valeurs dérivées
  const userId = session?.user?.id || null
  const userEmail = session?.user?.email || null
  const isAuthenticated = !!session

  // Fonction de connexion - AUTH SEULEMENT
  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setIsAuthLoading(true)
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          shouldCreateUser: false
        }
      })

      if (authError) {
        console.error('🔐 Login error:', authError)
        return { success: false, error: authError.message }
      }

      console.log('🔐 Login successful for:', authData.user?.email)
      // La session sera mise à jour par onAuthStateChange
      return { success: true }
    } catch (error) {
      console.error('🔐 Login catch error:', error)
      return { success: false, error: 'Erreur de connexion' }
    } finally {
      setIsAuthLoading(false)
    }
  }

  // Fonction d'inscription - AUTH SEULEMENT  
  const register = async (userData: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    password: string
    confirmPassword: string
    acceptTerms: boolean
    newsletter: boolean
  }) => {
    setIsAuthLoading(true)
    try {
      // Validations côté client
      if (userData.password !== userData.confirmPassword) {
        return { success: false, error: 'Les mots de passe ne correspondent pas' }
      }
      
      if (!userData.acceptTerms) {
        return { success: false, error: 'Vous devez accepter les conditions générales' }
      }

      // Créer le compte utilisateur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
          }
        }
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      if (authData.user) {
        console.log('🔐 User registered successfully:', authData.user.email)
        
        // Mettre à jour le customer créé automatiquement avec le téléphone si fourni
        if (userData.phone) {
          try {
            const { error: customerError } = await supabase
              .from('customers')
              .update({
                phone: userData.phone,
                newsletter: userData.newsletter
              })
              .eq('profile_id', authData.user.id)
            
            if (customerError) {
              console.error('🔐 Error updating customer profile:', customerError)
              // On ne fait pas échouer l'inscription pour autant
            } else {
              console.log('🔐 Customer profile updated with phone:', userData.phone)
            }
          } catch (error) {
            console.error('🔐 Error in customer update:', error)
            // On ne fait pas échouer l'inscription pour autant
          }
        }
        
        return { success: true }
      }

      return { success: false, error: 'Erreur lors de la création du compte' }
    } catch (error) {
      console.error('🔐 Register error:', error)
      return { success: false, error: 'Erreur lors de l\'inscription' }
    } finally {
      setIsAuthLoading(false)
    }
  }

  // Fonction de déconnexion - AUTH SEULEMENT
  const logout = async () => {
    setIsAuthLoading(true)
    try {
      await supabase.auth.signOut()
      console.log('🔐 Logout successful')
    } catch (error) {
      console.error('🔐 Logout error:', error)
    } finally {
      setIsAuthLoading(false)
    }
  }

  // Initialisation simple de l'authentification
  useEffect(() => {
    let mounted = true

    // Récupérer la session initiale
    const initializeAuth = async () => {
      try {
        console.log('🔐 Initializing auth...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (error) {
          console.error('🔐 Error getting initial session:', error)
        } else {
          console.log('🔐 Initial session:', session?.user?.email || 'no user')
          setSession(session)
        }
        
        setIsAuthInitialized(true)
      } catch (error) {
        console.error('🔐 Error in initializeAuth:', error)
        if (mounted) {
          setIsAuthInitialized(true)
        }
      }
    }

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return

      console.log('🔐 Auth state change:', event, session?.user?.email || 'no user')
      
      setSession(session)
      
      if (!isAuthInitialized) {
        setIsAuthInitialized(true)
      }
    })

    // Démarrer l'initialisation
    initializeAuth()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value: AuthContextType = {
    session,
    userId,
    userEmail,
    isAuthenticated,
    isAuthLoading,
    isAuthInitialized,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}