import React from 'react';
import { useScreenSize } from '../../hooks/useScreenSize';
import FooterMobile from './FooterMobile';
import FooterDesktop from './FooterDesktop';

const Footer: React.FC = () => {
  const { isMobile } = useScreenSize();

  return isMobile ? <FooterMobile /> : <FooterDesktop />;
};

export default Footer;