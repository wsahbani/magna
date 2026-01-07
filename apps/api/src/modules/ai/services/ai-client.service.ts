/**
 * AI Client Service
 * Abstraction pour l'intégration avec OpenAI
 * Gère les appels API, retry, error handling, et token counting
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { AIGenerateOptions, AIGenerateResponse } from '../interfaces/ai.interface';

/**
 * Configuration du proxy LLM OpenRouter
 */

const LLM_CONFIG = {
  apiKey: process.env.LLM_PROXY_API_KEY,
  baseURL: process.env.LLM_PROXY_BASE_URL,
  defaultModel: process.env.LLM_PROXY_DEFAULT_MODEL, // Utiliser gpt-4o-mini pour respecter le budget
};

console.log('LLM Proxy Configuration:', LLM_CONFIG);
@Injectable()
export class AIClientService implements OnModuleInit {
  private readonly logger = new Logger(AIClientService.name);
  private openai: OpenAI | null = null;
  private readonly defaultModel: string;
  private readonly defaultMaxTokens = 2000; // Réduit pour respecter les limites de crédits
  private readonly defaultVisionMaxTokens = 2000; // Limite spécifique pour les appels vision
  private readonly defaultTemperature = 0.7;
  private readonly visionModel = process.env.LLM_PROXY_VISION_MODEL;
  constructor(private readonly configService: ConfigService) {
    // Utiliser gpt-4o-mini pour respecter le budget de $10/mois
    this.defaultModel = LLM_CONFIG.defaultModel;
  }

  onModuleInit() {
    this.logger.log(`Initializing AI Client with model: ${LLM_CONFIG.defaultModel}`);
    this.logger.log(`Using OpenRouter LLM proxy: ${LLM_CONFIG.baseURL}`);
    
    this.openai = new OpenAI({
      apiKey: LLM_CONFIG.apiKey,
      baseURL: LLM_CONFIG.baseURL,
    });
    this.logger.log('OpenAI client initialized with OpenRouter LLM proxy');
  }

  /**
   * Génère une réponse à partir d'un prompt
   */
  async generate(
    prompt: string,
    options: AIGenerateOptions = {},
  ): Promise<AIGenerateResponse> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized. Check OPENAI_API_KEY environment variable.');
    }

    const model = options.model || this.defaultModel;
    const maxTokens = options.maxTokens || this.defaultMaxTokens;
    const temperature = options.temperature ?? this.defaultTemperature;

    try {
      this.logger.log(`Generating with model ${model}, maxTokens: ${maxTokens}`);

      // Le prompt peut être une string complète ou déjà séparé
      // Si le prompt contient '\n\n', on sépare, sinon on utilise tout comme user prompt
      const promptParts = prompt.includes('\n\n') ? prompt.split('\n\n') : [prompt];
      const systemPrompt = promptParts[0] || 'Tu es un assistant IA expert.';
      const userPrompt = promptParts.length > 1 ? promptParts.slice(1).join('\n\n') : prompt;

      // Utiliser le modèle configuré (gptMini par défaut pour le budget)
      const modelToUse = model || this.defaultModel;
      
      this.logger.debug(`Calling LLM proxy with model: ${modelToUse}`);
      
      const response = await this.openai.chat.completions.create({
        model: modelToUse,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        max_tokens: maxTokens,
        temperature,
        response_format: { type: 'json_object' }, // Force JSON response
      });

      const content = response.choices[0]?.message?.content || '';
      const tokensUsed = {
        prompt: response.usage?.prompt_tokens || 0,
        completion: response.usage?.completion_tokens || 0,
        total: response.usage?.total_tokens || 0,
      };

      this.logger.log(`Generation completed. Tokens used: ${tokensUsed.total}`);

      return {
        content,
        tokensUsed,
        model: response.model,
      };
    } catch (error: any) {
      this.logger.error(`OpenAI API error: ${error.message}`, error.stack);
      
      // Gestion spécifique des erreurs de crédits OpenRouter
      if (error.message?.includes('402') || error.message?.includes('credits')) {
        const creditError = new Error(
          `Crédits insuffisants pour cette requête. ${error.message}. ` +
          `Réduisez maxTokens ou augmentez vos crédits sur https://openrouter.ai/settings/credits`
        );
        creditError.name = 'InsufficientCreditsError';
        throw creditError;
      }
      
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  /**
   * Génère une réponse à partir d'un prompt et d'une image (vision)
   * Utilise GPT-4o pour la vision
   */
  async generateFromImage(
    prompt: string,
    imageBase64: string,
    mimeType: string,
    options: AIGenerateOptions = {},
  ): Promise<AIGenerateResponse> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized. Check OPENAI_API_KEY environment variable.');
    }

    // Utiliser GPT-4o pour la vision (ou GPT-4o-2024-11-20 si disponible)
    const visionModel = this.visionModel;
    const maxTokens = options.maxTokens || this.defaultVisionMaxTokens;
    const temperature = options.temperature ?? this.defaultTemperature;

    try {
      this.logger.log(`Generating with vision model ${visionModel}, maxTokens: ${maxTokens}`);

      // Séparer le prompt en system et user
      const promptParts = prompt.includes('\n\n') ? prompt.split('\n\n') : [prompt];
      const systemPrompt = promptParts[0] || 'Tu es un assistant IA expert.';
      const userPrompt = promptParts.length > 1 ? promptParts.slice(1).join('\n\n') : prompt;

      // Format image pour OpenRouter: data:image/png;base64,...
      const imageUrl = `data:${mimeType};base64,${imageBase64}`;

      const response = await this.openai.chat.completions.create({
        model: visionModel,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPrompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: maxTokens,
        temperature,
        response_format: options.responseFormat || { type: 'json_object' }, // Use provided format or default to JSON
      });

      const content = response.choices[0]?.message?.content || '';
      const tokensUsed = {
        prompt: response.usage?.prompt_tokens || 0,
        completion: response.usage?.completion_tokens || 0,
        total: response.usage?.total_tokens || 0,
      };

      this.logger.log(`Vision generation completed. Tokens used: ${tokensUsed.total}`);

      return {
        content,
        tokensUsed,
        model: response.model,
      };
    } catch (error: any) {
      this.logger.error(`OpenAI Vision API error: ${error.message}`, error.stack);
      
      // Gestion spécifique des erreurs de crédits OpenRouter
      if (error.message?.includes('402') || error.message?.includes('credits')) {
        const creditError = new Error(
          `Crédits insuffisants pour cette requête. ${error.message}. ` +
          `Réduisez maxTokens ou augmentez vos crédits sur https://openrouter.ai/settings/credits`
        );
        creditError.name = 'InsufficientCreditsError';
        throw creditError;
      }
      
      throw new Error(`AI vision generation failed: ${error.message}`);
    }
  }

  /**
   * Calcule le coût estimé en dollars
   */
  calculateCost(tokensUsed: { prompt: number; completion: number; total: number }): number {
    // Prix GPT-4 (approximatif, à ajuster selon les prix réels)
    const inputCostPer1K = 0.03; // $0.03 per 1K input tokens
    const outputCostPer1K = 0.06; // $0.06 per 1K output tokens

    const inputCost = (tokensUsed.prompt / 1000) * inputCostPer1K;
    const outputCost = (tokensUsed.completion / 1000) * outputCostPer1K;

    return inputCost + outputCost;
  }
}

