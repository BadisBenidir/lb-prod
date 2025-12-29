import React from 'react';
import { useScreenSize } from '../../hooks/useScreenSize';
import BoutiqueHighlightMobile from './BoutiqueHighlightMobile';
import BoutiqueHighlightDesktop from './BoutiqueHighlightDesktop';

interface BoutiqueHighlightProps {
  onNavigateToBoutique?: () => void;
  featuredProducts?: Array<{
    id: string;
    name: string;
    price: number;
    images?: string[];
    image?: string;
    brand?: string;
    brand_name?: string;
  }>;
}

const BoutiqueHighlight: React.FC<BoutiqueHighlightProps> = ({ 
  onNavigateToBoutique,
  featuredProducts = []
}) => {
  const { isMobile } = useScreenSize();

  return isMobile ? (
    <BoutiqueHighlightMobile 
      onNavigateToBoutique={onNavigateToBoutique}
      featuredProducts={featuredProducts}
    />
  ) : (
    <BoutiqueHighlightDesktop 
      onNavigateToBoutique={onNavigateToBoutique}
      featuredProducts={featuredProducts}
    />
  );
};

export default BoutiqueHighlight;