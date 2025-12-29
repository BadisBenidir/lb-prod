import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginPage as LoginComponent } from '../features/auth';
import { useAuth } from '../contexts/AuthContext';

const LoginPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthLoading, isAuthInitialized, isAuthenticated } = useAuth();

  // Rediriger automatiquement après une connexion réussie
  React.useEffect(() => {
    if (isAuthInitialized && isAuthenticated) {
      console.log('🔐 User authenticated, redirecting to profile...');
      navigate('/profil');
    }
  }, [isAuthenticated, isAuthInitialized, navigate]);

  const handleLogin = async (email: string, password: string, rememberMe: boolean = false) => {
    const result = await login(email, password, rememberMe);
    // Ne pas rediriger ici - laisser useEffect gérer ça
    return result;
  };

  const handleNavigateToRegister = () => {
    navigate('/register');
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleLoginSuccess = () => {
    // Cette fonction ne sera plus utilisée, la redirection est automatique
    console.log('🔐 Login success callback (automatic redirect handled by useEffect)');
  };

  // Affichage simple : attendre seulement que l'auth soit initialisée
  if (!isAuthInitialized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-gray-600 mb-4">Initialisation...</div>
        </div>
      </div>
    );
  }

  return (
    <LoginComponent
      onLogin={handleLogin}
      onNavigateToRegister={handleNavigateToRegister}
      onClose={handleClose}
      onLoginSuccess={handleLoginSuccess}
      isLoading={isAuthLoading}
    />
  );
};

export default LoginPageWrapper;