import React from 'react';
import { useScreenSize } from '../../hooks/useScreenSize';
import CheckoutPage from './CheckoutPage';
import CheckoutPageMobile from './CheckoutPageMobile';

const CheckoutPageWrapper: React.FC = () => {
  const { isMobile } = useScreenSize();

  return isMobile ? (
    <CheckoutPageMobile />
  ) : (
    <CheckoutPage />
  );
};

export default CheckoutPageWrapper;