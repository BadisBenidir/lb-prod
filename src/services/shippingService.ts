import { karrio } from 'karrio';

// Types pour les frais d'expédition
export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country_code: string;
}

export interface PackageDetails {
  weight: number; // en kg
  length: number; // en cm
  width: number;  // en cm
  height: number; // en cm
}

export interface ShippingRate {
  service_name: string;
  service_code: string;
  total_price: number;
  currency: string;
  delivery_days: number;
  estimated_delivery: string;
}

export interface ShippingRequest {
  from_address: ShippingAddress;
  to_address: ShippingAddress;
  packages: PackageDetails[];
}

// Configuration Karrio
const karrioClient = karrio({
  api_key: import.meta.env.VITE_KARRIO_API_KEY || 'your_karrio_api_key',
  host: import.meta.env.VITE_KARRIO_HOST || 'https://api.karrio.io',
});

/**
 * Service pour calculer les frais d'expédition DHL
 */
export class ShippingService {
  /**
   * Calcule les frais d'expédition DHL pour une destination donnée
   */
  static async calculateDHLRates(request: ShippingRequest): Promise<ShippingRate[]> {
    try {
      // Configuration de la requête pour DHL
      const rateRequest = {
        shipper: {
          street_number: request.from_address.street,
          city: request.from_address.city,
          state_code: request.from_address.state,
          postal_code: request.from_address.postal_code,
          country_code: request.from_address.country_code,
        },
        recipient: {
          street_number: request.to_address.street,
          city: request.to_address.city,
          state_code: request.to_address.state,
          postal_code: request.to_address.postal_code,
          country_code: request.to_address.country_code,
        },
        packages: request.packages.map(pkg => ({
          weight: pkg.weight,
          length: pkg.length,
          width: pkg.width,
          height: pkg.height,
        })),
        services: ['dhl_express', 'dhl_ground', 'dhl_international'], // Services DHL disponibles
      };

      // Appel à l'API Karrio pour obtenir les tarifs
      const response = await karrioClient.rates.create(rateRequest);

      // Transformation des résultats
      const rates: ShippingRate[] = response.rates?.map(rate => ({
        service_name: rate.service_name || 'DHL Service',
        service_code: rate.service_code || 'dhl',
        total_price: parseFloat(rate.total_charge || '0'),
        currency: rate.currency || 'EUR',
        delivery_days: parseInt(rate.delivery_days || '0'),
        estimated_delivery: rate.estimated_delivery || '',
      })) || [];

      return rates;
    } catch (error) {
      console.error('Erreur lors du calcul des frais d\'expédition:', error);
      throw new Error('Impossible de calculer les frais d\'expédition');
    }
  }

  /**
   * Calcule les frais d'expédition pour un panier
   */
  static async calculateCartShipping(
    cartItems: any[],
    toAddress: ShippingAddress,
    fromAddress?: ShippingAddress
  ): Promise<ShippingRate[]> {
    // Adresse d'expédition par défaut (votre entrepôt)
    const defaultFromAddress: ShippingAddress = {
      street: '123 Rue de la Logistique',
      city: 'Paris',
      state: 'IDF',
      postal_code: '75001',
      country_code: 'FR',
    };

    // Calcul du poids total et des dimensions
    const totalWeight = cartItems.reduce((sum, item) => sum + (item.weight || 0.5), 0);
    const totalVolume = cartItems.reduce((sum, item) => {
      const volume = (item.length || 10) * (item.width || 10) * (item.height || 10);
      return sum + volume;
    }, 0);

    // Estimation des dimensions basée sur le volume
    const cubeRoot = Math.cbrt(totalVolume);
    const estimatedDimensions = {
      length: Math.ceil(cubeRoot),
      width: Math.ceil(cubeRoot),
      height: Math.ceil(cubeRoot),
    };

    const request: ShippingRequest = {
      from_address: fromAddress || defaultFromAddress,
      to_address: toAddress,
      packages: [{
        weight: Math.max(totalWeight, 0.1), // Minimum 100g
        ...estimatedDimensions,
      }],
    };

    return this.calculateDHLRates(request);
  }

  /**
   * Valide une adresse d'expédition
   */
  static async validateAddress(address: ShippingAddress): Promise<boolean> {
    try {
      const response = await karrioClient.address.validate({
        address: {
          street_number: address.street,
          city: address.city,
          state_code: address.state,
          postal_code: address.postal_code,
          country_code: address.country_code,
        },
      });

      return response.validation?.is_valid || false;
    } catch (error) {
      console.error('Erreur lors de la validation d\'adresse:', error);
      return false;
    }
  }
}

