import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Hook pour récupérer toutes les valeurs de filtres disponibles
export const useAvailableFilters = () => {
  const [colors, setColors] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableFilters = async () => {
      try {
        setLoading(true);
        
        // Récupérer tous les produits en vente avec leurs attributs
        const { data, error } = await supabase
          .from('products')
          .select('colors, material, genre, condition')
          .eq('status', 'for-sale-online');

        if (error) throw error;

        if (data) {
          // Extraire les couleurs uniques depuis le JSONB
          const allColors = new Set<string>();
          data.forEach(product => {
            if (product.colors && Array.isArray(product.colors)) {
              product.colors.forEach((color: string) => {
                if (color && color.trim()) {
                  allColors.add(color.trim());
                }
              });
            }
          });
          setColors(Array.from(allColors).sort());

          // Extraire les matières uniques
          const allMaterials = new Set<string>();
          data.forEach(product => {
            if (product.material && typeof product.material === 'string') {
              allMaterials.add(product.material.trim());
            }
          });
          setMaterials(Array.from(allMaterials).sort());

          // Extraire les genres uniques
          const allGenres = new Set<string>();
          data.forEach(product => {
            if (product.genre) {
              allGenres.add(product.genre);
            }
          });
          setGenres(Array.from(allGenres).sort());

          // Extraire les conditions uniques et les convertir au format client
          const allConditions = new Set<string>();
          data.forEach(product => {
            if (product.condition) {
              // Convertir condition DB vers format client
              const conditionMap: Record<string, string> = {
                'neuf': 'New',
                'excellent': 'Excellent',
                'very-good': 'Very Good',
                'good': 'Good',
                'fair': 'Fair'
              };
              const clientCondition = conditionMap[product.condition] || product.condition;
              allConditions.add(clientCondition);
            }
          });
          setConditions(Array.from(allConditions).sort());
        }

      } catch (err) {
        console.error('Erreur lors du chargement des filtres:', err);
        setError('Erreur lors du chargement des filtres');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableFilters();
  }, []);

  return {
    colors,
    materials,
    genres,
    conditions,
    loading,
    error
  };
};