import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterPage as RegisterComponent } from '../features/auth';
import { useAuth } from '../contexts/AuthContext';

const RegisterPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (userData: { email: string; password: string; firstName: string; lastName: string }) => {
    return await register({
      ...userData,
      confirmPassword: userData.password,
      acceptTerms: true,
      newsletter: false
    });
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleNavigateToWelcome = () => {
    navigate('/welcome');
  };

  return (
    <RegisterComponent
      onRegister={handleRegister}
      onNavigateToLogin={handleNavigateToLogin}
      onClose={handleClose}
      onNavigateToWelcome={handleNavigateToWelcome}
      isLoading={false}
    />
  );
};

export default RegisterPageWrapper;