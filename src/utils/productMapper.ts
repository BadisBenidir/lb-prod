import { DbProductWithRelations, Product } from '../types';

/**
 * Convertit les conditions de la DB vers le format client
 */
export const mapConditionToClient = (dbCondition: string): Product['condition'] => {
  const normalize = (s?: string) =>
    (s ?? '')
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[_-]/g, ' ')
      .replace(/\s+/g, ' ');
  
  const key = normalize(dbCondition);

  const conditionMap: Record<string, Product['condition']> = {
    'new': 'New',
    'brand new': 'New',
    'neuf': 'New',

    'excellent': 'Excellent',

    'very good': 'Very Good',
    'tres bon': 'Very Good',
    'tres bonne': 'Very Good',
    'very-good': 'Very Good',
    'very_good': 'Very Good',
    'd': 'Very Good',
    'brand very good': 'Very Good',

    'good': 'Good',
    'bon': 'Good',

    'fair': 'Fair'
  };

  console.log('[COND] raw=', dbCondition);
  
  return conditionMap[dbCondition] || 'Good';
};

/**
 * Détermine si un produit est en stock basé sur son statut
 */
export const isProductInStock = (status: string): boolean => {
  return ['for-sale-online', 'for-sale-other-platform'].includes(status);
};

/**
 * Détermine si un produit est en statut "vendu - affiché" (pour le marketing)
 */
export const isProductSoldDisplay = (status: string): boolean => {
  return status === 'sold-display';
};

/**
 * Récupère l'image principale d'un produit
 */
export const getMainProductImage = (images: string[], mainImageIndex: number): string => {
  if (!images || images.length === 0) {
    return 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  
  const imageIndex = Math.max(0, Math.min(mainImageIndex, images.length - 1));
  return images[imageIndex] || images[0];
};

/**
 * Convertit un produit DB avec relations vers le format client
 */
export const mapDbProductToClient = (dbProduct: DbProductWithRelations): Product => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    brand: dbProduct.brand?.name || 'Unknown',
    category: dbProduct.category?.name || 'Unknown',
    price: dbProduct.sale_price,
    originalPrice: undefined, // Pas d'affichage du prix d'achat !
    image: getMainProductImage(dbProduct.images, dbProduct.main_image_index),
    condition: mapConditionToClient(dbProduct.condition),
    description: dbProduct.description || '',
    inStock: isProductInStock(dbProduct.status),
    isSoldDisplay: isProductSoldDisplay(dbProduct.status),
    // Champs supplémentaires
    productCode: dbProduct.product_code,
    genre: dbProduct.genre,
    colors: dbProduct.colors || [],
    material: dbProduct.material,
    weight: dbProduct.weight,
    images: dbProduct.images || [],
    defects: dbProduct.defects,
    defectImages: dbProduct.defect_images || [],
    serialNumber: dbProduct.serial_number
  };
};

/**
 * Convertit une liste de produits DB vers le format client
 */
export const mapDbProductsToClient = (dbProducts: DbProductWithRelations[]): Product[] => {
  return dbProducts.map(mapDbProductToClient);
};