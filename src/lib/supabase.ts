import { createClient } from '@supabase/supabase-js'

// Configuration Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Stockage sécurisé dans localStorage par défaut
    storage: window.localStorage,
    // Vérifier la session toutes les 30 secondes
    flowType: 'pkce'
  }
})

// Types pour la table profiles
export interface Profile {
  id: string
  email: string
  first_name: string
  last_name: string
  role: 'admin' | 'client'
  created_at: string
  updated_at: string
}

// Types pour la table customers
export interface Customer {
  id: string
  profile_id: string
  customer_code: string
  phone: string | null
  newsletter: boolean
  birth_date: string | null
  address_line1: string | null
  address_line2: string | null
  city: string | null
  postal_code: string | null
  country: string
  created_at: string
  updated_at: string
}