import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface OIDCDiscovery {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
  introspection_endpoint?: string;
  device_authorization_endpoint?: string;
  end_session_endpoint?: string;
  scopes_supported: string[];
  response_types_supported: string[];
  grant_types_supported: string[];
  code_challenge_methods_supported?: string[];
}

@Injectable()
export class OIDCDiscoveryService implements OnModuleInit {
  private readonly logger = new Logger(OIDCDiscoveryService.name);
  private discoveryConfig: OIDCDiscovery | null = null;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.discoverConfiguration();
  }

  async discoverConfiguration(): Promise<OIDCDiscovery | undefined | null> {
    if (this.discoveryConfig) {
      return this.discoveryConfig;
    }

    const discoveryUri = this.configService.get<string>('OIDC_DISCOVERY_URI');
    
    if (!discoveryUri || discoveryUri === 'NOT_SET') {
        this.logger.error('OIDC_DISCOVERY_URI is not configured');
      
    }

    try {
      this.logger.log(`Discovering OIDC configuration from: ${discoveryUri}`);
      
      const response = await fetch(discoveryUri, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        this.logger.error(`Discovery request failed: ${response.status} ${response.statusText}`);
        // throw new Error(`Discovery request failed: ${response.status} ${response.statusText}`);
      }

      const discoveryData = await response.json();
      
      this.discoveryConfig = {
        issuer: discoveryData.issuer,
        authorization_endpoint: discoveryData.authorization_endpoint,
        token_endpoint: discoveryData.token_endpoint,
        userinfo_endpoint: discoveryData.userinfo_endpoint,
        jwks_uri: discoveryData.jwks_uri,
        introspection_endpoint: discoveryData.introspection_endpoint,
        device_authorization_endpoint: discoveryData.device_authorization_endpoint,
        end_session_endpoint: discoveryData.end_session_endpoint,
        scopes_supported: discoveryData.scopes_supported || [],
        response_types_supported: discoveryData.response_types_supported || [],
        grant_types_supported: discoveryData.grant_types_supported || [],
        code_challenge_methods_supported: discoveryData.code_challenge_methods_supported || [],
      };

      this.logger.log('OIDC Discovery completed successfully');
      this.logger.debug('Discovered configuration:', this.discoveryConfig);

      return this.discoveryConfig;
    } catch (error) {
      this.logger.error('Failed to discover OIDC configuration:', error);
    }
  }

  getDiscoveryConfig(): OIDCDiscovery | null {
    return this.discoveryConfig;
  }

  async getAuthorizationEndpoint(): Promise<string> {
    const config = await this.discoverConfiguration();
    return config.authorization_endpoint;
  }

  async getTokenEndpoint(): Promise<string> {
    const config = await this.discoverConfiguration();
    return config.token_endpoint;
  }

  async getUserInfoEndpoint(): Promise<string> {
    const config = await this.discoverConfiguration();
    return config.userinfo_endpoint;
  }

  async getJwksUri(): Promise<string> {
    const config = await this.discoverConfiguration();
    return config.jwks_uri;
  }

  async getIssuer(): Promise<string> {
    const config = await this.discoverConfiguration();
    return config.issuer;
  }

  async getSupportedScopes(): Promise<string[]> {
    const config = await this.discoverConfiguration();
    return config.scopes_supported;
  }

  async supportsPKCE(): Promise<boolean> {
    const config = await this.discoverConfiguration();
    return config.code_challenge_methods_supported?.includes('S256') || false;
  }
}
