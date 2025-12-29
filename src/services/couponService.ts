import { supabase } from '../lib/supabase';

export interface CouponValidationResult {
  isValid: boolean;
  couponId?: string;
  discountType?: 'percentage' | 'fixed_amount';
  discountValue?: number;
  calculatedDiscount?: number;
  errorMessage?: string;
}

export interface AppliedCoupon {
  code: string;
  couponId: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  calculatedDiscount: number;
}

/**
 * Valide un code promo et calcule la réduction
 */
export const validateCoupon = async (
  code: string,
  email: string,
  subtotal: number
): Promise<CouponValidationResult> => {
  try {
    if (!code || !code.trim()) {
      return {
        isValid: false,
        errorMessage: 'Veuillez entrer un code promo'
      };
    }

    if (!email || !email.trim()) {
      return {
        isValid: false,
        errorMessage: 'Email requis pour valider le code promo'
      };
    }

    // Appeler la fonction SQL validate_coupon
    const { data, error } = await supabase.rpc('validate_coupon', {
      p_code: code.toUpperCase().trim(),
      p_email: email.toLowerCase().trim(),
      p_subtotal: subtotal
    });

    if (error) {
      console.error('Erreur validation coupon:', error);
      return {
        isValid: false,
        errorMessage: 'Erreur lors de la validation du code promo'
      };
    }

    // La fonction retourne un tableau avec un seul résultat
    const result = data?.[0];

    if (!result) {
      return {
        isValid: false,
        errorMessage: 'Code promo invalide'
      };
    }

    if (!result.is_valid) {
      return {
        isValid: false,
        couponId: result.coupon_id,
        errorMessage: result.error_message || 'Code promo invalide'
      };
    }

    return {
      isValid: true,
      couponId: result.coupon_id,
      discountType: result.discount_type,
      discountValue: result.discount_value,
      calculatedDiscount: result.calculated_discount
    };

  } catch (err) {
    console.error('Erreur validation coupon:', err);
    return {
      isValid: false,
      errorMessage: 'Erreur lors de la validation du code promo'
    };
  }
};

/**
 * Enregistre l'utilisation d'un coupon après le paiement
 */
export const useCoupon = async (
  couponId: string,
  email: string,
  userId: string | null,
  orderId: string,
  discountApplied: number
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('use_coupon', {
      p_coupon_id: couponId,
      p_email: email.toLowerCase().trim(),
      p_user_id: userId,
      p_order_id: orderId,
      p_discount_applied: discountApplied
    });

    if (error) {
      console.error('Erreur enregistrement coupon:', error);
      return false;
    }

    return data === true;

  } catch (err) {
    console.error('Erreur enregistrement coupon:', err);
    return false;
  }
};
