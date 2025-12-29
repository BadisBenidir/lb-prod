import React from 'react';
import { useScreenSize } from '../../hooks/useScreenSize';
import HeroMobile from './HeroMobile';
import HeroDesktop from './HeroDesktop';

interface HeroProps {
  onNavigate?: (page: 'home' | 'boutique' | 'about' | 'selection' | 'sell') => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { isMobile } = useScreenSize();

  return isMobile ? (
    <HeroMobile onNavigate={onNavigate} />
  ) : (
    <HeroDesktop onNavigate={onNavigate} />
  );
};

export default Hero;