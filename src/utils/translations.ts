/**
 * Fonction utilitaire pour traduire les conditions de produits en français
 */
export const translateCondition = (condition: string): string => {
  const translations: Record<string, string> = {
    'Neuf': 'neuf',
    'Excellent': 'excellent',
    'Très Bon': 'Très Bon', 
    'Bon': 'Bon',
    'Correct': 'Correct'
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
    case 'Neuf':
      return 'bg-blue-500 text-white';
    case 'Excellent':
      return 'bg-green-500 text-white';
    case 'Très Bon':
      return 'bg-gray-600 text-white';
    case 'Bon':
      return 'bg-yellow-500 text-white';
    case 'Correct':
      return 'bg-orange-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};
