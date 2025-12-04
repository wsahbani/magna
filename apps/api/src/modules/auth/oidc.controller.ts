import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { OIDCDiscoveryService } from './services/oidc-discovery.service';
import { AuthService } from './auth.service';
import { Public } from './guards/public.decorator';
import { OidcAuthGuard } from './guards/oidc-auth.guard';
//@ts-ignore
import pkceChallenge from 'pkce-challenge';

@ApiTags('OIDC Authentication')
@Controller('auth/oidc')
export class OidcController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private oidcDiscoveryService: OIDCDiscoveryService,
  ) {}

  /**
   * Orange OpenID Connect - Initiate login with PKCE
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Login with Orange SSO (OpenID Connect)' })
  async oidcAuth(@Res() res: Response) {
    try {
      // Get the authorization endpoint from discovery
      const authorizationEndpoint = await this.oidcDiscoveryService.getAuthorizationEndpoint();
      
      // Get OIDC configuration from environment
      const clientId = this.configService.get<string>('OIDC_CLIENT_ID');
      const callbackUrl = this.configService.get<string>('OIDC_CALLBACK_URL');
      const scopesString = this.configService.get<string>('OIDC_SCOPES') || 
        'openid profile email';
      
      if (!clientId || !callbackUrl) {
        throw new UnauthorizedException(
          'OIDC configuration incomplete: client_id and callback_url are required',
        );
      }

      // Generate PKCE challenge
      const challenge = await pkceChallenge(128);

      // Build the authorization URL
      const authUrl = new URL(authorizationEndpoint);
      authUrl.searchParams.append('client_id', clientId);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('redirect_uri', callbackUrl);
      authUrl.searchParams.append('scope', scopesString);
      authUrl.searchParams.append('code_challenge_method', 'S256');
      authUrl.searchParams.append('code_challenge', challenge.code_challenge);
      authUrl.searchParams.append('state', await this.generateState());

      console.log('OIDC Auth URL:', authUrl.toString());
      
      // Redirect to the OIDC provider
      res.redirect(authUrl.toString());
    } catch (error: any) {
      throw new UnauthorizedException(`OIDC authentication failed: ${error?.message || 'Unknown error'}`);
    }
  }

  private async generateState(): Promise<string> {
    // Generate a random state parameter for CSRF protection
    const challenge = await pkceChallenge(128);
    return challenge.code_challenge;
  }

  /**
   * Orange OpenID Connect - Callback
   */
  @Public()
  @Get('callback')
  @UseGuards(OidcAuthGuard)
  @ApiOperation({ summary: 'Orange SSO callback endpoint' })
  async oidcCallback(@Req() req: any, @Res() res: Response) {
    // This route handles the callback from Orange Group's OIDC provider
    const loginResponse = await this.authService.login(req.user);
    
    // Redirect to frontend with tokens
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/auth/callback?token=${loginResponse.accessToken}`;
    
    return res.redirect(redirectUrl);
  }
}
