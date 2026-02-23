import React from 'react';

interface WelcomePageProps {
  onCompleteProfile: () => void;
  onSkip: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onCompleteProfile, onSkip }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white border border-gray-200 p-8 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-light text-black mb-4">
            Bienvenue chez Ozë Paris
          </h1>
          
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Votre compte a été créé avec succès et est maintenant actif. Un email de confirmation
            vous a été envoyé. Pour profiter pleinement de nos services, nous vous invitons à
            compléter vos informations personnelles.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-medium text-black mb-3">
            Complétez votre profil pour :
          </h2>
          <ul className="text-left space-y-2">
            <li className="flex items-center text-gray-700">
              <svg className="w-5 h-5 text-black mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Accéder à nos recommandations personnalisées
            </li>
            <li className="flex items-center text-gray-700">
              <svg className="w-5 h-5 text-black mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Faciliter vos futures commandes
            </li>
            <li className="flex items-center text-gray-700">
              <svg className="w-5 h-5 text-black mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recevoir des offres exclusives adaptées à vos goûts
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onCompleteProfile}
            className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 transition duration-200"
          >
            Compléter mon profil
          </button>
          <button 
            onClick={onSkip}
            className="flex-1 bg-white hover:bg-gray-50 text-black border border-gray-300 font-medium py-3 px-6 transition duration-200"
          >
            Passer cette étape
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;