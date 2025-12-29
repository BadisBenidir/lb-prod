import React from 'react';
import { useScreenSize } from '../../hooks/useScreenSize';
import UserOrders from './UserOrders';
import UserOrdersMobile from './UserOrdersMobile';

interface UserOrdersWrapperProps {
  userId?: string;
  email?: string;
}

const UserOrdersWrapper: React.FC<UserOrdersWrapperProps> = ({ userId, email }) => {
  const { isMobile } = useScreenSize();

  return isMobile ? (
    <UserOrdersMobile userId={userId} email={email} />
  ) : (
    <UserOrders userId={userId} email={email} />
  );
};

export default UserOrdersWrapper;