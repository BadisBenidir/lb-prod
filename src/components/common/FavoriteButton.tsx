import React from 'react';
import { Heart } from 'lucide-react';
import { useIsFavorite } from '../../hooks/useIsFavorite';

interface FavoriteButtonProps {
  productId: string;
  userId: string | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  onToggle?: (isFavorite: boolean, action: 'added' | 'removed') => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  productId, 
  userId, 
  className = '',
  size = 'md',
  showText = false,
  onToggle 
}) => {
  const { isFavorite, isLoading, error, toggleFavorite, clearError } = useIsFavorite(userId, productId);

  // Ne rien afficher si l'utilisateur n'est pas connecté
  if (!userId) {
    return null;
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;

    clearError();
    const result = await toggleFavorite();
    
    if (result.success && result.action && onToggle) {
      onToggle(result.action === 'added', result.action);
    }
  };

  // Tailles pour les icônes et boutons
  const sizes = {
    sm: {
      icon: 'h-4 w-4',
      button: 'py-2 px-2', // Même hauteur que les boutons standards
      text: 'text-xs'
    },
    md: {
      icon: 'h-5 w-5',
      button: 'py-2 md:py-3 px-3', // Même hauteur que le bouton panier
      text: 'text-sm'
    },
    lg: {
      icon: 'h-6 w-6',
      button: 'py-3 md:py-4 px-4',
      text: 'text-base'
    }
  };

  const sizeConfig = sizes[size];

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`
          ${sizeConfig.button}
          transition-all 
          duration-200 
          focus:outline-none 
          focus:ring-2 
          focus:ring-red-500 
          focus:ring-opacity-50
          disabled:opacity-50 
          disabled:cursor-not-allowed
          ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}
          ${className}
        `}
        title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        <div className="relative">
          <Heart 
            className={`
              ${sizeConfig.icon} 
              transition-transform 
              duration-200
              ${isLoading ? 'animate-pulse' : ''}
              ${isFavorite ? 'fill-current scale-110' : 'hover:scale-110'}
            `}
          />
          
          {/* Animation de pulse lors du clic */}
          {isLoading && (
            <div className={`
              absolute 
              inset-0 
              ${sizeConfig.icon} 
              rounded-full 
              bg-red-500 
              opacity-25 
              animate-ping
            `} />
          )}
        </div>
        
        {showText && (
          <span className={`ml-2 font-medium ${sizeConfig.text}`}>
            {isFavorite ? 'Favori' : 'Ajouter'}
          </span>
        )}
      </button>

      {/* Message d'erreur */}
      {error && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-red-100 text-red-600 text-xs rounded whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  );
};

export default FavoriteButton;