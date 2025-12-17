import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-openidconnect';
import { ConfigService } from '@nestjs/config';
import { PrismaAuthProvider } from '../providers/prisma-auth.provider';
import { OIDCDiscoveryService } from '../services/oidc-discovery.service';

@Injectable()
export class OpenIDStrategy extends PassportStrategy(Strategy, 'openidconnect') {
  private readonly logger = new Logger(OpenIDStrategy.name);

  constructor(
    private configService: ConfigService,
    private authProvider: PrismaAuthProvider,
    private discoveryService: OIDCDiscoveryService,
  ) {
    // Initialize strategy synchronously, discovery will be handled separately
    const scopesString = configService.get<string>('OIDC_SCOPES') || 'openid profile email';
    const scopes = scopesString.split(' ').filter(scope => scope.length > 0);

    super({
      issuer: 'placeholder', // Will be updated after discovery
      authorizationURL: 'placeholder',
      tokenURL: 'placeholder', 
      userInfoURL: 'placeholder',
      clientID: configService.get<string>('OIDC_CLIENT_ID') || '',
      clientSecret: configService.get<string>('OIDC_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('OIDC_CALLBACK_URL') || '',
      scope: scopes,
    });

    // Update configuration after discovery completes
    // this.initializeFromDiscovery();
  }

  private async initializeFromDiscovery() {
    try {
      const config = await this.discoveryService.discoverConfiguration();
      
      if (!config) {
        this.logger.warn('OIDC discovery configuration not available');
        return;
      }

      // Update the strategy configuration with discovered endpoints
      (this as any)._options.issuer = config.issuer;
      (this as any)._options.authorizationURL = config.authorization_endpoint;
      (this as any)._options.tokenURL = config.token_endpoint;
      (this as any)._options.userInfoURL = config.userinfo_endpoint;

      this.logger.log('OpenID Connect strategy initialized with discovered configuration');
    } catch (error) {
      this.logger.error('Failed to initialize OIDC strategy from discovery:', error);
    }
  }

  async validate(
    issuer: string,
    profile: Profile,
    context: any,
    idToken: string,
    accessToken: string,
    refreshToken: string,
    done: (error: any, user?: any) => void,
  ) {
    try {
      this.logger.debug(`Validating OIDC user: ${profile.id}`);
      
      // Extract user information from the profile
      const email = profile.emails?.[0]?.value;
      const firstName = profile.name?.givenName;
      const lastName = profile.name?.familyName;
      const orangeId = profile.id; // Orange Group's internal user ID

      // Extract additional Orange Group specific claims
      const profileJson = (profile as any)._json || {};
      const jti = profileJson.jti; // JWT ID for token tracking
      const scope = profileJson.scope; // User's granted scopes
      const sub = profileJson.sub; // Subject identifier

      if (!email) {
        this.logger.error('No email found in OIDC profile');
        return done(new Error('Email is required from OIDC provider'));
      }

      // Find or create user in database
      let user = await this.authProvider.findUserByEmail(email);
      
      if (!user) {
        // Create new user from OIDC profile
        user = await this.authProvider.createOidcUser({
          email,
          firstName,
          lastName,
          orangeId: sub || orangeId,
          profile: {
            ...profileJson,
            jti,
            scope,
            sub,
          },
        });
        this.logger.log(`Created new OIDC user: ${email}`);
      } else if (user.provider !== 'orange-openid' && user.provider !== 'local') {
        // User exists but with different auth type
        this.logger.error(`User ${email} exists with different auth type: ${user.provider}`);
        return done(new Error('User exists with different authentication method'));
      } else {
        // Update existing OIDC user profile
        user = await this.authProvider.updateOidcUser(user.id, {
          firstName,
          lastName,
          orangeId: sub || orangeId,
          profile: {
            ...profileJson,
            jti,
            scope,
            sub,
          },
        });
        this.logger.debug(`Updated existing OIDC user: ${email}`);
      }

      // Store tokens for future API calls to Orange systems
      await this.authProvider.storeOidcTokens(user.id, {
        idToken,
        accessToken,
        refreshToken,
        expiresAt: context.tokenset?.expires_at,
        jti,
        scope: Array.isArray(scope) ? scope.join(' ') : scope,
      });

      return done(null, user);
    } catch (error) {
      this.logger.error('Error validating OIDC user:', error);
      return done(error);
    }
  }
}
