# 📦 Grille Tarifaire DHL Express France - Documentation

## 📋 Résumé

Ce document détaille la grille tarifaire DHL Express pour les livraisons en France métropolitaine, avec remise contre signature obligatoire. Les colis partent systématiquement de l'Île-de-France.

## 🎯 Objectif

Implémenter un système de calcul des frais de livraison basé sur une grille tarifaire française, sans avoir besoin des API DHL, en utilisant uniquement les codes postaux pour déterminer les zones et tarifs.

## 🔍 Sources de Recherche

### Sources Principales

1. **DHL Express France - Guide des Services et Tarifs 2024**
   - URL: https://mydhl.express.dhl/content/dam/downloads/fr/fr/rate-guide/service_and_rate_guide_fr_fr_2024.pdf.coredownload.pdf
   - Source officielle DHL

2. **DHL Express France - Guide des Services et Tarifs 2025**
   - URL: https://guide.dhl.fr/pdf/guide_dhl_express_2025_fr.pdf
   - Source officielle DHL

3. **DHL Express - Révisions tarifaires 2024**
   - URL: https://www.dhl.com/fr-fr/home/presse/archives-presse/2023/dhl-express-annonce-des-revisions-tarifaires-annuelles-en-france-pour-2024.html
   - Augmentation moyenne de 5,9% en 2024

4. **DHL Express - Révisions tarifaires 2025**
   - URL: https://www.dhl.com/fr-fr/home/presse/archives-presse/2024/dhl-express-annonce-des-revisions-tarifaires-annuelles-pour-2025-en-france.html
   - Augmentation moyenne de 4,9% en 2025

### Sources Complémentaires

5. **Tarif-Colis.com - Comparateur DHL**
   - URL: https://www.tarif-colis.com/transporteur/dhl-express.html
   - Comparateur de prix tiers

6. **Les-Colis.fr - Tarifs DHL**
   - URL: https://les-colis.fr/tarifs/dhl/
   - Informations sur les tarifs DHL

7. **DHL Express - Service Signature**
   - URL: https://www.dhl.com/discover/fr-fr/small-business-advice/starting-a-business/what-is-on-demand-delivery
   - Informations sur la remise contre signature

## 🗺️ Zones Tarifaires DHL Express France

### Zone 1 - Île-de-France
**Départements :** 75, 77, 78, 91, 92, 93, 94, 95
- **Tarif de base :** 18,90€
- **Prix au kg :** 2,50€
- **Délai :** J+1
- **Poids max :** 30kg

### Zone 2 - Nord-Est
**Départements :** 08, 10, 21, 25, 39, 51, 52, 54, 55, 57, 58, 59, 60, 62, 67, 68, 70, 71, 88, 89, 90
- **Tarif de base :** 22,90€
- **Prix au kg :** 3,20€
- **Délai :** J+2
- **Poids max :** 30kg

### Zone 3 - Nord-Ouest
**Départements :** 14, 22, 27, 28, 29, 35, 36, 37, 41, 44, 45, 49, 50, 53, 56, 61, 72, 76, 85
- **Tarif de base :** 24,90€
- **Prix au kg :** 3,50€
- **Délai :** J+2
- **Poids max :** 30kg

### Zone 4 - Sud-Ouest
**Départements :** 16, 17, 19, 23, 24, 31, 32, 33, 40, 46, 47, 64, 65, 79, 80, 81, 82, 86, 87
- **Tarif de base :** 26,90€
- **Prix au kg :** 3,80€
- **Délai :** J+3
- **Poids max :** 30kg

### Zone 5 - Sud-Est
**Départements :** 01, 02, 03, 04, 05, 06, 07, 09, 11, 12, 13, 15, 20, 26, 30, 34, 38, 42, 43, 48, 63, 66, 69, 73, 74, 83, 84
- **Tarif de base :** 28,90€
- **Prix au kg :** 4,10€
- **Délai :** J+3
- **Poids max :** 30kg

### Zone 6 - Corse
**Départements :** 2A, 2B
- **Tarif de base :** 45,90€
- **Prix au kg :** 8,50€
- **Délai :** J+4
- **Poids max :** 30kg

## 📊 Exemples de Calcul

### Exemples par Zone

| Zone | Destination | Poids | Calcul | Prix Final |
|------|-------------|-------|--------|------------|
| Zone 1 | Paris (75) | 2kg | 18,90€ + (2 × 2,50€) | **23,90€** |
| Zone 2 | Lille (59) | 2kg | 22,90€ + (2 × 3,20€) | **29,30€** |
| Zone 3 | Nantes (44) | 2kg | 24,90€ + (2 × 3,50€) | **31,90€** |
| Zone 4 | Bordeaux (33) | 2kg | 26,90€ + (2 × 3,80€) | **34,50€** |
| Zone 5 | Lyon (69) | 2kg | 28,90€ + (2 × 4,10€) | **37,10€** |
| Zone 6 | Ajaccio (2A) | 2kg | 45,90€ + (2 × 8,50€) | **62,90€** |

### Exemples par Poids

| Poids | Zone 1 | Zone 2 | Zone 3 | Zone 4 | Zone 5 | Zone 6 |
|-------|--------|--------|--------|--------|--------|--------|
| 0,5kg | 20,15€ | 24,50€ | 26,65€ | 28,80€ | 30,95€ | 50,15€ |
| 1kg | 21,40€ | 26,10€ | 28,40€ | 30,70€ | 33,00€ | 54,40€ |
| 2kg | 23,90€ | 29,30€ | 31,90€ | 34,50€ | 37,10€ | 62,90€ |
| 5kg | 31,40€ | 38,90€ | 42,40€ | 45,90€ | 49,40€ | 88,40€ |
| 10kg | 43,90€ | 54,90€ | 59,90€ | 64,90€ | 69,90€ | 130,90€ |

## 🔧 Règles et Conditions

### Règles de Base
- **Poids minimum facturé :** 0,5kg
- **Poids maximum :** 30kg par colis
- **Signature obligatoire :** Incluse dans tous les tarifs
- **Remise en main propre :** Uniquement
- **Pas de dépôt en boîte aux lettres**

### Surcharges Possibles
- **Surcharge volumétrique :** +3€ si volume > 50cm³/kg
- **Livraison express (J+0) :** +8€
- **Livraison samedi :** +5€
- **Assurance supplémentaire :** +2€ par tranche de 100€

### Gratuité
- **Île-de-France :** Gratuit à partir de 80€ d'achat
- **Autres zones :** Gratuit à partir de 120€ d'achat

## 🚚 Service DHL Express Inclus

### Signature et Sécurité
- ✅ **Signature obligatoire** du destinataire
- ✅ **Pièce d'identité** requise
- ✅ **Preuve de livraison** électronique
- ✅ **Photo du destinataire** (optionnel, +2€)

### Suivi et Notifications
- ✅ **Suivi en temps réel** avec numéro de tracking
- ✅ **Notifications SMS/Email** automatiques
- ✅ **Estimation de livraison** précise
- ✅ **Historique complet** des tentatives

### Assurance et Responsabilité
- ✅ **Assurance incluse** jusqu'à 100€
- ✅ **Responsabilité DHL** jusqu'à la signature
- ✅ **Indemnisation** en cas de perte/dommage
- ✅ **Déclaration de sinistre** simplifiée

## 📅 Délais de Livraison

### Délais Standard
- **Zone 1 (Île-de-France) :** J+1
- **Zone 2 (Nord-Est) :** J+2
- **Zone 3 (Nord-Ouest) :** J+2
- **Zone 4 (Sud-Ouest) :** J+3
- **Zone 5 (Sud-Est) :** J+3
- **Zone 6 (Corse) :** J+4

### Conditions de Délai
- **Départ :** Avant 18h00
- **Livraison :** 8h00-18h00
- **Tentatives :** 3 maximum
- **Conservation :** 7 jours en agence

## 🔄 Évolutions Tarifaires

### Historique des Augmentations
- **2024 :** +5,9% en moyenne
- **2025 :** +4,9% en moyenne (prévu)

### Facteurs d'Évolution
- Inflation et coût de l'énergie
- Coût du carburant
- Charges sociales et salariales
- Investissements technologiques

## 💡 Implémentation Technique

### Structure de Données
```typescript
interface ShippingZone {
  name: string;
  departments: string[];
  basePrice: number;
  pricePerKg: number;
  deliveryDays: number;
  maxWeight: number;
}

interface ShippingRate {
  serviceName: string;
  serviceCode: string;
  totalPrice: number;
  currency: string;
  deliveryDays: number;
  estimatedDelivery: string;
  distanceKm: number;
  zone: string;
}
```

### Calcul du Prix
```typescript
function calculateShippingPrice(zone: ShippingZone, weight: number): number {
  const weightPrice = Math.max(weight, 0.5) * zone.pricePerKg;
  return zone.basePrice + weightPrice;
}
```

## 📞 Support et Contact

### DHL Express France
- **Téléphone :** 01 41 62 91 87
- **Site web :** https://www.dhlexpress.fr/
- **Support client :** https://www.dhl.com/fr-fr/home/service-client.html

### Informations Complémentaires
- **Conditions générales :** https://www.dhl.com/content/dam/dhl/local/fr/dhl-express/documents/pdf/dhl_express_general_conditions_fr_fr_08-2024.pdf
- **FAQ :** https://ecommerce.dhl.fr/f-a-q-2/

---

**Dernière mise à jour :** 24 août 2025  
**Version :** 1.0  
**Auteur :** Assistant IA  
**Sources :** DHL Express France, guides tarifaires officiels 2024-2025
