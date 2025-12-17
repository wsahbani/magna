/**
 * AI Cache Service
 * Gère le cache des réponses IA pour optimiser les coûts
 * Utilise un cache en mémoire avec hash du prompt
 */

import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

interface CachedResponse {
  content: string;
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
  model: string;
  timestamp: number;
}

@Injectable()
export class AICacheService {
  private readonly logger = new Logger(AICacheService.name);
  private readonly cache = new Map<string, CachedResponse>();
  private readonly ttl = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

  /**
   * Génère un hash du prompt pour l'utiliser comme clé de cache
   */
  private hashPrompt(prompt: string): string {
    return crypto.createHash('sha256').update(prompt).digest('hex');
  }

  /**
   * Récupère une réponse du cache si elle existe et n'est pas expirée
   */
  get(prompt: string): CachedResponse | null {
    const key = this.hashPrompt(prompt);
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // Vérifier si le cache est expiré
    const now = Date.now();
    if (now - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      this.logger.debug(`Cache expired for key: ${key.substring(0, 8)}...`);
      return null;
    }

    this.logger.debug(`Cache hit for key: ${key.substring(0, 8)}...`);
    return cached;
  }

  /**
   * Stocke une réponse dans le cache
   */
  set(
    prompt: string,
    content: string,
    tokensUsed: { prompt: number; completion: number; total: number },
    model: string,
  ): void {
    const key = this.hashPrompt(prompt);
    this.cache.set(key, {
      content,
      tokensUsed,
      model,
      timestamp: Date.now(),
    });
    this.logger.debug(`Cached response for key: ${key.substring(0, 8)}...`);
  }

  /**
   * Nettoie le cache des entrées expirées
   */
  cleanExpired(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.logger.log(`Cleaned ${cleaned} expired cache entries`);
    }
  }

  /**
   * Retourne les statistiques du cache
   */
  getStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: 1000, // Limite arbitraire
    };
  }
}

