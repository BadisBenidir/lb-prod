// Utilitaires de validation pour l'inscription

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// Validation de l'email
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, message: 'L\'adresse email est obligatoire' };
  }
  
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Format d\'email invalide' };
  }
  
  return { isValid: true };
};

// Validation du mot de passe
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: 'Le mot de passe est obligatoire' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Le mot de passe doit contenir au moins 8 caractères' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'Le mot de passe doit contenir au moins une minuscule' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'Le mot de passe doit contenir au moins une majuscule' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Le mot de passe doit contenir au moins un chiffre' };
  }
  
  return { isValid: true };
};

// Validation du téléphone français
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) return { isValid: true }; // Optionnel
  
  const phoneRegex = /^(?:\+33|0)[1-9](?:[0-9]{8})$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { isValid: false, message: 'Format de téléphone invalide (ex: 06 12 34 56 78)' };
  }
  
  return { isValid: true };
};

// Validation des noms
export const validateName = (name: string, fieldName: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, message: `${fieldName} est obligatoire` };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, message: `${fieldName} doit contenir au moins 2 caractères` };
  }
  
  const nameRegex = /^[a-zA-ZÀ-ÿ\s-']+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, message: `${fieldName} ne doit contenir que des lettres` };
  }
  
  return { isValid: true };
};

// Validation de confirmation de mot de passe
export const validatePasswordConfirmation = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, message: 'La confirmation du mot de passe est obligatoire' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Les mots de passe ne correspondent pas' };
  }
  
  return { isValid: true };
};

// Validation complète du formulaire d'inscription
export const validateRegistrationForm = (formData: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}): Record<string, ValidationResult> => {
  return {
    firstName: validateName(formData.firstName, 'Le prénom'),
    lastName: validateName(formData.lastName, 'Le nom'),
    email: validateEmail(formData.email),
    phone: validatePhone(formData.phone || ''),
    password: validatePassword(formData.password),
    confirmPassword: validatePasswordConfirmation(formData.password, formData.confirmPassword),
    acceptTerms: {
      isValid: formData.acceptTerms,
      message: formData.acceptTerms ? undefined : 'Vous devez accepter les conditions générales'
    }
  };
};

// Vérifier si tous les champs sont valides
export const isFormValid = (validationResults: Record<string, ValidationResult>): boolean => {
  return Object.values(validationResults).every(result => result.isValid);
};

// Simuler la vérification d'email unique
export const checkEmailUniqueness = async (email: string): Promise<ValidationResult> => {
  // Simulation d'un appel API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simuler quelques emails déjà pris
  const existingEmails = ['admin@ligneblanche.com', 'test@example.com', 'user@demo.fr'];
  
  if (existingEmails.includes(email.toLowerCase())) {
    return { isValid: false, message: 'Cette adresse email est déjà utilisée' };
  }
  
  return { isValid: true };
};