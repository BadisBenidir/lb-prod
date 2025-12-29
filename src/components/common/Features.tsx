import React from 'react';
import { useScreenSize } from '../../hooks/useScreenSize';
import FeaturesMobile from './FeaturesMobile';
import FeaturesDesktop from './FeaturesDesktop';

interface FeaturesProps {
  onNavigate?: (page: 'home' | 'boutique' | 'about' | 'selection' | 'sell') => void;
}

const Features: React.FC<FeaturesProps> = ({ onNavigate }) => {
  const { isMobile } = useScreenSize();

  return isMobile ? (
    <FeaturesMobile onNavigate={onNavigate} />
  ) : (
    <FeaturesDesktop onNavigate={onNavigate} />
  );
};

export default Features;