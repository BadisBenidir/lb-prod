import { karrio } from 'karrio';

/**
 * Script de test pour vérifier la configuration Karrio
 */
export async function testKarrioConnection() {
  console.log('🧪 Test de connexion Karrio...');
  
  try {
    // Configuration du client Karrio
    const karrioClient = karrio({
      api_key: import.meta.env.VITE_KARRIO_API_KEY || 'test_key',
      host: import.meta.env.VITE_KARRIO_HOST || 'https://api.karrio.io',
    });

    console.log('✅ Client Karrio configuré');
    console.log('📋 Configuration:');
    console.log('  - Host:', import.meta.env.VITE_KARRIO_HOST || 'https://api.karrio.io');
    console.log('  - API Key:', import.meta.env.VITE_KARRIO_API_KEY ? '✅ Configurée' : '❌ Manquante');

    // Test simple de validation d'adresse
    const testAddress = {
      street: '123 Test Street',
      city: 'Paris',
      state: 'IDF',
      postal_code: '75001',
      country_code: 'FR',
    };

    console.log('🔍 Test de validation d\'adresse...');
    
    try {
      const validationResponse = await karrioClient.address.validate({
        address: {
          street_number: testAddress.street,
          city: testAddress.city,
          state_code: testAddress.state,
          postal_code: testAddress.postal_code,
          country_code: testAddress.country_code,
        },
      });

      console.log('✅ Validation d\'adresse réussie');
      console.log('📊 Résultat:', validationResponse);
      
    } catch (validationError) {
      console.log('⚠️ Erreur de validation (normal si pas de clé API):', validationError);
    }

    return {
      success: true,
      message: 'Configuration Karrio vérifiée',
      hasApiKey: !!import.meta.env.VITE_KARRIO_API_KEY,
    };

  } catch (error) {
    console.error('❌ Erreur lors du test Karrio:', error);
    return {
      success: false,
      message: 'Erreur de configuration Karrio',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

/**
 * Fonction pour afficher les variables d'environnement (en mode développement)
 */
export function logKarrioConfig() {
  if (import.meta.env.DEV) {
    console.log('🔧 Configuration Karrio:');
    console.log('  VITE_KARRIO_API_KEY:', import.meta.env.VITE_KARRIO_API_KEY ? '✅' : '❌');
    console.log('  VITE_KARRIO_HOST:', import.meta.env.VITE_KARRIO_HOST || 'https://api.karrio.io');
  }
}
