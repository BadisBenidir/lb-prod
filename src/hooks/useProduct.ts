import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DbProductWithRelations, Product } from '../types';
import { mapDbProductToClient } from '../utils/productMapper';

export const useProduct = (productId: string | null) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setProduct(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: queryError } = await supabase
          .from('products')
          .select(`
            *,
            brand:brands(*),
            category:categories(*)
          `)
          .eq('id', productId)
          .in('status', ['for-sale-online', 'sold-display'])
          .single();

        if (queryError) {
          if (queryError.code === 'PGRST116') {
            throw new Error('Produit non trouvé');
          }
          throw queryError;
        }

        const typedData = data as DbProductWithRelations;
        const clientProduct = mapDbProductToClient(typedData);
        
        setProduct(clientProduct);

      } catch (err: any) {
        console.error('Erreur lors du chargement du produit:', err);
        setError(err.message || 'Erreur lors du chargement du produit');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return {
    product,
    loading,
    error
  };
};