import React, { useState } from 'react';
import { testKarrioConnection, logKarrioConfig } from '../../utils/karrioTest';

const KarrioTest: React.FC = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    setIsLoading(true);
    logKarrioConfig();
    
    try {
      const result = await testKarrioConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Erreur lors du test',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">🧪 Test Configuration Karrio</h3>
      
      <button
        onClick={handleTest}
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Test en cours...' : 'Tester la connexion'}
      </button>

      {testResult && (
        <div className="mt-4 p-4 border rounded">
          <h4 className="font-medium mb-2">Résultat du test:</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Statut:</span>{' '}
              <span className={testResult.success ? 'text-green-600' : 'text-red-600'}>
                {testResult.success ? '✅ Succès' : '❌ Échec'}
              </span>
            </div>
            <div>
              <span className="font-medium">Message:</span> {testResult.message}
            </div>
            {testResult.hasApiKey !== undefined && (
              <div>
                <span className="font-medium">Clé API:</span>{' '}
                <span className={testResult.hasApiKey ? 'text-green-600' : 'text-yellow-600'}>
                  {testResult.hasApiKey ? '✅ Configurée' : '⚠️ Manquante'}
                </span>
              </div>
            )}
            {testResult.error && (
              <div>
                <span className="font-medium">Erreur:</span>{' '}
                <span className="text-red-600">{testResult.error}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded text-sm">
        <h4 className="font-medium mb-2">📋 Instructions:</h4>
        <ul className="space-y-1 text-gray-600">
          <li>• Créez un fichier <code>.env</code> dans le dossier <code>lb-client</code></li>
          <li>• Ajoutez <code>VITE_KARRIO_API_KEY=votre_clé_api</code></li>
          <li>• Redémarrez l'application après modification</li>
        </ul>
      </div>
    </div>
  );
};

export default KarrioTest;
