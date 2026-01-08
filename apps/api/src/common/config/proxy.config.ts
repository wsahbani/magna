/**
 * Proxy Configuration Service
 * 
 * Manages proxy configuration for external API calls (OpenAI, etc.)
 * Required for Orange Platform deployments where external calls must go through FPC proxy
 * 
 * Environment Variables:
 * - PROXY_ENABLED: Enable/disable proxy (true/false)
 * - PROXY_USER: Proxy authentication username
 * - PROXY_PASSWORD: Proxy authentication password
 * - PROXY_HOST: Proxy server hostname
 * - PROXY_PORT: Proxy server port
 * - PROXY_PROTOCOL: Proxy protocol (http/https)
 */

import { Injectable, Logger } from '@nestjs/common';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';

export interface ProxyConfig {
  enabled: boolean;
  user: string;
  password: string;
  host: string;
  port: number;
  protocol: 'http' | 'https';
}

@Injectable()
export class ProxyConfigService {
  private static instance: ProxyConfigService;
  private readonly logger = new Logger(ProxyConfigService.name);
  private readonly config: ProxyConfig;
  private httpsAgent: HttpsProxyAgent<string> | null = null;
  private httpAgent: HttpProxyAgent<string> | null = null;

  constructor() {
    // Singleton pattern
    if (ProxyConfigService.instance) {
      return ProxyConfigService.instance;
    }

    // Read configuration from environment variables
    this.config = {
      enabled: process.env.PROXY_ENABLED === 'true',
      user: process.env.PROXY_USER || '',
      password: process.env.PROXY_PASSWORD || '',
      host: process.env.PROXY_HOST || '',
      port: parseInt(process.env.PROXY_PORT || '8443', 10),
      protocol: (process.env.PROXY_PROTOCOL as 'http' | 'https') || 'https',
    };

    if (this.config.enabled) {
      this.validateConfig();
      this.initializeAgents();
      this.logProxyConfiguration();
    } else {
      this.logger.log('Proxy is disabled');
    }

    ProxyConfigService.instance = this;
  }

  /**
   * Validates that all required proxy configuration is present
   */
  private validateConfig(): void {
    const required = ['user', 'password', 'host'];
    const missing = required.filter((key) => !this.config[key]);

    if (missing.length > 0) {
      throw new Error(
        `Proxy is enabled but missing required configuration: ${missing.join(', ')}. ` +
        `Please set PROXY_${missing.map(k => k.toUpperCase()).join(', PROXY_')} environment variables.`
      );
    }

    if (this.config.port < 1 || this.config.port > 65535) {
      throw new Error(`Invalid proxy port: ${this.config.port}. Must be between 1 and 65535.`);
    }
  }

  /**
   * Initializes proxy agents for HTTP and HTTPS
   */
  private initializeAgents(): void {
    const proxyUrl = this.buildProxyUrl();
    
    try {
      this.httpsAgent = new HttpsProxyAgent(proxyUrl);
      this.httpAgent = new HttpProxyAgent(proxyUrl);
      this.logger.log('Proxy agents initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize proxy agents', error);
      throw error;
    }
  }

  /**
   * Builds the proxy URL with credentials
   */
  private buildProxyUrl(): string {
    const { protocol, user, password, host, port } = this.config;
    
    // Encode credentials to handle special characters
    const encodedUser = encodeURIComponent(user);
    const encodedPassword = encodeURIComponent(password);
    
    return `${protocol}://${encodedUser}:${encodedPassword}@${host}:${port}`;
  }

  /**
   * Logs proxy configuration (without exposing password)
   */
  private logProxyConfiguration(): void {
    this.logger.log('Proxy Configuration:');
    this.logger.log(`  - Enabled: ${this.config.enabled}`);
    this.logger.log(`  - Protocol: ${this.config.protocol}`);
    this.logger.log(`  - Host: ${this.config.host}`);
    this.logger.log(`  - Port: ${this.config.port}`);
    this.logger.log(`  - User: ${this.config.user}`);
    this.logger.log(`  - Password: ${'*'.repeat(this.config.password.length)}`);
  }

  /**
   * Returns whether proxy is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Returns the HTTPS proxy agent for HTTP clients
   * Use this with OpenAI SDK and other HTTP clients
   */
  getHttpsAgent(): HttpsProxyAgent<string> | null {
    if (!this.config.enabled) {
      return null;
    }
    return this.httpsAgent;
  }

  /**
   * Returns the HTTP proxy agent for HTTP clients
   */
  getHttpAgent(): HttpProxyAgent<string> | null {
    if (!this.config.enabled) {
      return null;
    }
    return this.httpAgent;
  }

  /**
   * Returns the proxy URL (without credentials for logging)
   */
  getProxyUrl(): string | null {
    if (!this.config.enabled) {
      return null;
    }
    return `${this.config.protocol}://${this.config.host}:${this.config.port}`;
  }

  /**
   * Returns the full proxy configuration
   */
  getConfig(): ProxyConfig {
    return { ...this.config };
  }
}
