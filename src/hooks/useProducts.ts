import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { DbProductWithRelations, Product } from '../types';
import { mapDbProductsToClient } from '../utils/productMapper';

interface UseProductsFilters {
  categories?: string[];
  brands?: string[];
  priceRange?: [number, number];
  conditions?: string[];
  colors?: string[];
  materials?: string[];
  genres?: string[];
  searchTerm?: string;
}

interface UseProductsOptions {
  filters?: UseProductsFilters;
  sortBy?: string;
  limit?: number;
  offset?: number;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // Mémoriser les options pour éviter les re-renders inutiles
  const memoizedOptions = useMemo(() => {
    return {
      filters: options.filters || {},
      sortBy: options.sortBy || 'name',
      limit: options.limit,
      offset: options.offset
    };
  }, [
    options.filters?.categories?.join(','),
    options.filters?.brands?.join(','),
    options.filters?.priceRange?.[0],
    options.filters?.priceRange?.[1],
    options.filters?.conditions?.join(','),
    options.filters?.colors?.join(','),
    options.filters?.materials?.join(','),
    options.filters?.genres?.join(','),
    options.filters?.searchTerm,
    options.sortBy,
    options.limit,
    options.offset
  ]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Application des filtres
      const { filters = {}, sortBy = 'created_at', limit, offset } = memoizedOptions;

      // Récupérer les IDs des catégories si nécessaire
      let categoryIds: string[] = [];
      if (filters.categories && filters.categories.length > 0) {
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('id')
          .in('name', filters.categories);
        categoryIds = categoriesData?.map(c => c.id) || [];
      }

      // Récupérer les IDs des marques si nécessaire
      let brandIds: string[] = [];
      if (filters.brands && filters.brands.length > 0) {
        const { data: brandsData } = await supabase
          .from('brands')
          .select('id')
          .in('name', filters.brands);
        brandIds = brandsData?.map(b => b.id) || [];
      }

      // Construction de la requête avec JOINs et comptage
      let query = supabase
        .from('products')
        .select(`
          *,
          brand:brands(*),
          category:categories(*)
        `, { count: 'exact' })
        .in('status', ['for-sale-online', 'sold-display']); // Produits en vente + vendus affichés

      // Filtre par catégories (par IDs)
      if (categoryIds.length > 0) {
        query = query.in('category_id', categoryIds);
      }

      // Filtre par marques (par IDs)
      if (brandIds.length > 0) {
        query = query.in('brand_id', brandIds);
      }

      // Filtre par prix
      if (filters.priceRange) {
        const [minPrice, maxPrice] = filters.priceRange;
        query = query.gte('sale_price', minPrice).lte('sale_price', maxPrice);
      }

      // Filtre par conditions
      if (filters.conditions && filters.conditions.length > 0) {
        // Convertir les conditions client vers DB
        const dbConditions = filters.conditions.map(condition => {
          const conditionMap: Record<string, string> = {
            'New': 'neuf',
            'Excellent': 'excellent',
            'Very Good': 'very-good', 
            'Good': 'good',
            'Fair': 'fair'
          };
          return conditionMap[condition] || condition.toLowerCase();
        });
        query = query.in('condition', dbConditions);
      }

      // Filtre par couleurs (JSONB array avec opérateur @> contains)
      if (filters.colors && filters.colors.length > 0) {
        // Construire une condition OR pour chaque couleur
        // Format: colors.cs.["noir"] OR colors.cs.["blanc"]
        const colorConditions = filters.colors
          .map(color => `colors.cs.["${color}"]`)
          .join(',');
        query = query.or(colorConditions);
      }

      // Filtre par matières
      if (filters.materials && filters.materials.length > 0) {
        query = query.in('material', filters.materials);
      }

      // Filtre par genre
      if (filters.genres && filters.genres.length > 0) {
        query = query.in('genre', filters.genres);
      }

      // Filtre par recherche (nom du produit)
      if (filters.searchTerm && filters.searchTerm.trim()) {
        const searchTerm = filters.searchTerm.trim();
        query = query.ilike('name', `%${searchTerm}%`);
      }

      // Tri
      switch (sortBy) {
        case 'name':
          query = query.order('name', { ascending: true });
          break;
        case 'price-low':
          query = query.order('sale_price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('sale_price', { ascending: false });
          break;
        case 'brand':
          query = query.order('brand.name', { ascending: true });
          break;
        default:
          query = query.order('name', { ascending: true });
      }

      // Pagination
      if (limit) {
        query = query.limit(limit);
      }
      if (offset) {
        query = query.range(offset, offset + (limit || 10) - 1);
      }

      // Exécuter la requête avec count
      const { data, error: queryError, count } = await query;
      
      // Debug: vérifier le statut de la requête
      console.log('Query result:', { dataLength: data?.length, count, error: queryError });

      if (queryError) throw queryError;

      console.log('Products fetched from DB:', data ? data.length : 0, 'items');
      console.log('Sample data:', data?.slice(0, 2));

      const typedData = data as DbProductWithRelations[];
      const clientProducts = mapDbProductsToClient(typedData);

      console.log('Client products after mapping:', clientProducts.length, 'items');

      // Log unique categories
      const uniqueCategories = [...new Set(clientProducts.map(p => p.category))];
      console.log('Unique categories found:', uniqueCategories);
      
      setProducts(clientProducts);
      setTotal(count || 0);

    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err);
      setError('Erreur lors du chargement des produits');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [memoizedOptions]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    total,
    refetch: fetchProducts
  };
};

// Hook pour récupérer les catégories disponibles (seulement celles avec des produits en vente)
export const useAvailableCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select(`
            category:categories(name)
          `)
          .in('status', ['for-sale-online', 'sold-display']);

        if (error) throw error;
        
        // Extraire les noms uniques des catégories
        const uniqueCategories = [...new Set(
          data?.map((item: any) => item.category?.name).filter(Boolean) || []
        )].sort();
        
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Erreur categories disponibles:', err);
        setError('Erreur lors du chargement des catégories');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableCategories();
  }, []);

  return { categories, loading, error };
};

// Hook pour récupérer les marques disponibles (seulement celles avec des produits en vente)
export const useAvailableBrands = () => {
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableBrands = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select(`
            brand:brands(name)
          `)
          .in('status', ['for-sale-online', 'sold-display']);

        if (error) throw error;
        
        // Extraire les noms uniques des marques et trier
        const uniqueBrands = [...new Set(
          data?.map((item: any) => item.brand?.name).filter(Boolean) || []
        )].sort();
        
        setBrands(uniqueBrands);
      } catch (err) {
        console.error('Erreur marques disponibles:', err);
        setError('Erreur lors du chargement des marques');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableBrands();
  }, []);

  return { brands, loading, error };
};