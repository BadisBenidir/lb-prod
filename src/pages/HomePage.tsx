import React from 'react';
import { useScreenSize } from '../hooks/useScreenSize';
import HomePageMobile from './HomePageMobile';
import HomePageDesktop from './HomePageDesktop';

const HomePage: React.FC = () => {
  const { isMobile } = useScreenSize();

  return isMobile ? <HomePageMobile /> : <HomePageDesktop />;
};

export default HomePage;