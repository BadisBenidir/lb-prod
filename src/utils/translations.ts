/**
 * Fonction utilitaire pour traduire les conditions de produits en français
 */
export const translateCondition = (condition: string): string => {
  const translations: Record<string, string> = {
    'New': 'Neuf',
    'Excellent': 'Excellent',
    'Very Good': 'Très Bon',
    'Good': 'Bon',
    'Fair': 'Correct'
  };

  return translations[condition] || condition;
};

/**
 * Fonction utilitaire pour traduire les catégories en français
 */
export const translateCategory = (category: string): string => {
  const translations: Record<string, string> = {
    'Vetements': 'Vêtements',
    'Sacs': 'Sacs',
    'Accessoires': 'Accessoires',
  };

  return translations[category] || category;
};

/**
 * Fonction utilitaire pour obtenir la classe CSS selon la condition
 */
export const getConditionClass = (condition: string): string => {
  switch (condition) {
    case 'New':
      return 'bg-blue-500 text-white';
    case 'Excellent':
      return 'bg-green-500 text-white';
    case 'Very Good':
      return 'bg-gray-600 text-white';
    case 'Good':
      return 'bg-yellow-500 text-white';
    case 'Fair':
      return 'bg-orange-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};
