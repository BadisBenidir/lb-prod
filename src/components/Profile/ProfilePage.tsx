import React from 'react';
import { User as UserType } from '../../types';
import { Customer } from '../../lib/supabase';
import { useScreenSize } from '../../hooks/useScreenSize';
import ProfilePageMobile from './ProfilePageMobile';
import ProfilePageDesktop from './ProfilePageDesktop';

interface ProfilePageProps {
  user: UserType;
  customer: Customer | null;
  onUpdateProfile: (userData: Partial<UserType>) => Promise<{ success: boolean; error?: string }>;
  onUpdateCustomerProfile: (customerData: any) => Promise<{ success: boolean; error?: string }>;
  onLogout: () => void;
  onCompleteProfile?: () => void;
  isLoading: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, customer, onUpdateProfile, onUpdateCustomerProfile, onLogout, onCompleteProfile, isLoading }) => {
  const { isMobile } = useScreenSize();

  const commonProps = {
    user,
    customer,
    onUpdateProfile,
    onUpdateCustomerProfile,
    onLogout,
    onCompleteProfile,
    isLoading
  };

  return isMobile ? (
    <ProfilePageMobile {...commonProps} />
  ) : (
    <ProfilePageDesktop {...commonProps} />
  );
};

export default ProfilePage;