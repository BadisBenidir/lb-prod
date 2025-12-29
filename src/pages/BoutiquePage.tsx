import React from 'react';
import { useScreenSize } from '../hooks/useScreenSize';
import BoutiquePageMobile from './BoutiquePageMobile';
import BoutiquePageDesktop from './BoutiquePageDesktop';

const BoutiquePage: React.FC = () => {
  const { isMobile } = useScreenSize();

  return isMobile ? <BoutiquePageMobile /> : <BoutiquePageDesktop />;
};

export default BoutiquePage;