import { CartSession } from '../types';

/**
 * Gestionnaire de session pour les paniers
 * Gère la création et la persistance des session IDs
 */
export class SessionManager {
  private static readonly SESSION_KEY = 'lb-cart-session';
  private static readonly SESSION_VERSION = '1.0';

  /**
   * Générer un UUID simple côté client
   */
  private static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Obtenir ou créer une session de panier
   */
  static getOrCreateSession(userId?: string): CartSession {
    try {
      const stored = localStorage.getItem(this.SESSION_KEY);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Valider la structure
        if (parsed.sessionId && parsed.version === this.SESSION_VERSION) {
          return {
            sessionId: parsed.sessionId,
            userId: userId || parsed.userId
          };
        }
      }
    } catch (error) {
      console.warn('Failed to parse stored cart session:', error);
    }

    // Créer une nouvelle session
    const newSession: CartSession = {
      sessionId: this.generateUUID(),
      userId
    };

    this.saveSession(newSession);
    return newSession;
  }

  /**
   * Sauvegarder la session
   */
  static saveSession(session: CartSession): void {
    try {
      const toStore = {
        sessionId: session.sessionId,
        userId: session.userId,
        version: this.SESSION_VERSION,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.error('Failed to save cart session:', error);
    }
  }

  /**
   * Mettre à jour l'utilisateur dans la session
   */
  static updateSessionUser(userId: string): CartSession {
    const session = this.getOrCreateSession();
    session.userId = userId;
    this.saveSession(session);
    return session;
  }

  /**
   * Nettoyer la session (déconnexion)
   */
  static clearUserFromSession(): CartSession {
    const session = this.getOrCreateSession();
    delete session.userId;
    this.saveSession(session);
    return session;
  }

  /**
   * Supprimer complètement la session
   */
  static clearSession(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear cart session:', error);
    }
  }

  /**
   * Obtenir la session actuelle sans la créer
   */
  static getCurrentSession(): CartSession | null {
    try {
      const stored = localStorage.getItem(this.SESSION_KEY);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        
        if (parsed.sessionId && parsed.version === this.SESSION_VERSION) {
          return {
            sessionId: parsed.sessionId,
            userId: parsed.userId
          };
        }
      }
    } catch (error) {
      console.warn('Failed to get current cart session:', error);
    }

    return null;
  }
}