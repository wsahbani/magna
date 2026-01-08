# Proxy Configuration for Orange Platform

## Overview

This document explains the proxy configuration system implemented for the NestJS API to enable external API calls (OpenAI/LLM services) through the Orange Platform FPC proxy.

## Why Proxy is Needed

When deploying applications on **Orange Platform VPS**, direct external API calls to services like OpenAI are blocked by network security policies. All external HTTP/HTTPS traffic must be routed through the **FPC (Forward Proxy Connector)** proxy server.

### Key Requirements
- ✅ All external API calls must go through the FPC proxy
- ✅ Proxy authentication is required (user/password)
- ✅ HTTPS protocol support
- ✅ Backward compatibility (no proxy in development)

## Architecture

### Components

1. **ProxyConfigService** (`src/common/config/proxy.config.ts`)
   - Singleton service managing proxy configuration
   - Reads from environment variables
   - Provides proxy agents for HTTP clients
   - Validates configuration on startup

2. **AIClientService** (`src/modules/ai/services/ai-client.service.ts`)
   - Updated to use ProxyConfigService
   - Configures OpenAI SDK with proxy agent when enabled
   - Logs proxy status for debugging

3. **AIModule** (`src/modules/ai/ai.module.ts`)
   - Provides ProxyConfigService to AI services
   - Ensures proper dependency injection

## Configuration

### Environment Variables

Add these variables to your `.env` file (for production) or `.env.local`:

```bash
# FPC Proxy Configuration (Orange Platform VPS)
# Enable proxy for external API calls in production environments
PROXY_ENABLED="true"                # Set to "true" to enable proxy
PROXY_PROTOCOL="https"              # Proxy protocol: http or https
PROXY_HOST="7391a136-1e0a-3487-9373-8ddc6b7ca009.op.fpc.ddns.intraorange"
PROXY_PORT="8443"                   # Proxy port (default: 8443)
PROXY_USER="7391a136-1e0a-3487-9373-8ddc6b7ca009"
PROXY_PASSWORD="jRl6KKyBGv47d931"
```

### Configuration by Environment

#### Development (Local)
```bash
PROXY_ENABLED="false"
# No other proxy variables needed
```

#### Production (Orange Platform VPS)
```bash
PROXY_ENABLED="true"
PROXY_PROTOCOL="https"
PROXY_HOST="7391a136-1e0a-3487-9373-8ddc6b7ca009.op.fpc.ddns.intraorange"
PROXY_PORT="8443"
PROXY_USER="7391a136-1e0a-3487-9373-8ddc6b7ca009"
PROXY_PASSWORD="jRl6KKyBGv47d931"
```

## How It Works

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Orange Platform VPS                          │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   NestJS Application                      │  │
│  │                                                             │  │
│  │  ┌────────────────────┐      ┌──────────────────────┐   │  │
│  │  │   AIClientService   │─────→│ ProxyConfigService   │   │  │
│  │  │                     │      │  (Singleton)         │   │  │
│  │  │ - Uses OpenAI SDK   │      │ - Reads ENV vars     │   │  │
│  │  │ - Adds proxy agent  │      │ - Creates agents     │   │  │
│  │  └────────────────────┘      │ - Validates config   │   │  │
│  │           │                   └──────────────────────┘   │  │
│  │           ▼                                               │  │
│  │  ┌────────────────────┐                                  │  │
│  │  │   OpenAI SDK with   │                                  │  │
│  │  │   HTTPS Proxy Agent │                                  │  │
│  │  └────────────────────┘                                  │  │
│  │           │                                               │  │
│  └───────────┼───────────────────────────────────────────────┘  │
│              │                                                   │
│              ▼                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │         FPC Proxy (Port 8443)                             │ │
│  │  - Authenticates with credentials                         │ │
│  │  - Routes external traffic                                │ │
│  └───────────────────────────────────────────────────────────┘ │
│              │                                                   │
└──────────────┼───────────────────────────────────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │   Internet           │
    │  (OpenAI API, etc.)  │
    └──────────────────────┘
```

### 1. Initialization Flow

```
Application Startup
    ↓
AIModule loads ProxyConfigService
    ↓
ProxyConfigService reads env variables
    ↓
If PROXY_ENABLED=true:
  - Validates configuration
  - Creates HTTPS/HTTP proxy agents
  - Logs proxy configuration
    ↓
AIClientService initializes
    ↓
AIClientService uses proxy agent from ProxyConfigService
    ↓
OpenAI SDK configured with proxy
    ↓
All API calls route through FPC proxy
```

### 2. Request Flow

```
AI Service Request (e.g., generateFromImage)
    ↓
AIClientService.generate() or generateFromImage()
    ↓
OpenAI SDK with proxy agent
    ↓
If proxy enabled:
  HTTPS Request → FPC Proxy (port 8443) → OpenAI API
Else:
  Direct HTTPS Request → OpenAI API
    ↓
Response returned to service
```

### 3. Proxy URL Construction

The proxy URL is constructed as:
```
https://[encoded_user]:[encoded_password]@[host]:[port]
```

Example:
```
https://7391a136-1e0a-3487-9373-8ddc6b7ca009:jRl6KKyBGv47d931@7391a136-1e0a-3487-9373-8ddc6b7ca009.op.fpc.ddns.intraorange:8443
```

## Testing

### Test 1: Verify Proxy Configuration

Check application logs on startup:

```bash
pnpm dev
# or in production:
pnpm start
```

**Expected output when proxy is enabled:**
```
[ProxyConfigService] Proxy Configuration:
[ProxyConfigService]   - Enabled: true
[ProxyConfigService]   - Protocol: https
[ProxyConfigService]   - Host: 7391a136-1e0a-3487-9373-8ddc6b7ca009.op.fpc.ddns.intraorange
[ProxyConfigService]   - Port: 8443
[ProxyConfigService]   - User: 7391a136-1e0a-3487-9373-8ddc6b7ca009
[ProxyConfigService]   - Password: ******************
[ProxyConfigService] Proxy agents initialized successfully
[AIClientService] Initializing AI Client with model: vertex_ai/claude4-sonnet
[AIClientService] Proxy enabled for OpenAI API calls: https://7391a136-1e0a-3487-9373-8ddc6b7ca009.op.fpc.ddns.intraorange:8443
[AIClientService] OpenAI client initialized with OpenRouter LLM proxy
```

**Expected output when proxy is disabled:**
```
[ProxyConfigService] Proxy is disabled
[AIClientService] Proxy is disabled - direct connection to OpenAI
```

### Test 2: Make an AI API Call

Use the process generation or image extraction endpoints:

```bash
# Test AI generation (through proxy if enabled)
curl -X POST http://localhost:3001/api/ai/generate-process-map \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "description": "Test process for proxy verification",
    "processMapId": "some-uuid"
  }'
```

Monitor logs for successful API calls:
```
[AIClientService] Generating with model vertex_ai/claude4-sonnet, maxTokens: 2000
[AIClientService] Generation completed. Tokens used: 1234
```

### Test 3: Verify Proxy Agent

Add debug logging in `ai-client.service.ts` (temporary):

```typescript
onModuleInit() {
  // ... existing code ...
  
  if (this.proxyConfig.isEnabled()) {
    const agent = this.proxyConfig.getHttpsAgent();
    this.logger.debug(`Proxy agent: ${JSON.stringify(agent)}`);
  }
}
```

### Test 4: Test Proxy Failure

Temporarily set wrong proxy credentials to ensure error handling works:

```bash
PROXY_PASSWORD="wrong_password"
```

Expected error:
```
[AIClientService] OpenAI API error: Proxy authentication failed
```

## Troubleshooting

### Issue 1: "Proxy is enabled but missing required configuration"

**Cause:** Required environment variables not set

**Solution:**
```bash
# Ensure all required variables are set:
PROXY_ENABLED="true"
PROXY_USER="..."
PROXY_PASSWORD="..."
PROXY_HOST="..."
```

### Issue 2: "Invalid proxy port"

**Cause:** PROXY_PORT is not a valid port number (1-65535)

**Solution:**
```bash
PROXY_PORT="8443"  # Valid port
```

### Issue 3: Proxy authentication fails

**Cause:** Wrong username or password

**Solution:**
- Verify credentials with Orange IT administrator
- Check for special characters that need encoding
- Ensure no trailing spaces in environment variables

### Issue 4: Connection timeout

**Cause:** Proxy host is unreachable or wrong

**Solution:**
- Verify proxy hostname is correct
- Check network connectivity to proxy
- Ensure VPS has access to FPC proxy

### Issue 5: SSL/TLS errors

**Cause:** HTTPS proxy certificate issues

**Solution:**
- Ensure PROXY_PROTOCOL="https"
- Check if proxy requires specific CA certificates
- May need to configure NODE_TLS_REJECT_UNAUTHORIZED (NOT recommended for production)

## Security Considerations

### ✅ Best Practices

1. **Never commit credentials to Git**
   - Use `.env` files (already in `.gitignore`)
   - Use environment variable injection in deployment

2. **Rotate credentials regularly**
   - Contact Orange IT for credential rotation
   - Update production environment variables

3. **Use HTTPS protocol**
   - Already configured in default settings
   - Ensures encrypted communication

4. **Limit proxy access**
   - Only enable in production environments
   - Keep disabled in development

### ⚠️ Important Notes

- **Credentials in this document are examples** - Use actual credentials from Orange IT
- **Do not expose proxy credentials** in logs or error messages
- **Password is masked** in logs (shown as asterisks)
- **Proxy URL without credentials** is logged for debugging

## Deployment Checklist

Before deploying to Orange Platform VPS:

- [ ] Verify all proxy environment variables are set
- [ ] Set `PROXY_ENABLED="true"`
- [ ] Confirm proxy credentials are correct
- [ ] Test AI generation endpoint works
- [ ] Check application logs for proxy initialization
- [ ] Verify no direct external API calls bypass proxy
- [ ] Document proxy configuration in deployment guide

## Integration with Other Services

### Adding Proxy Support to New Services

If you need to add proxy support to other external API calls:

```typescript
import { ProxyConfigService } from '../../common/config/proxy.config';

@Injectable()
export class MyExternalApiService {
  private proxyConfig: ProxyConfigService;

  constructor() {
    this.proxyConfig = new ProxyConfigService();
  }

  async callExternalApi() {
    const options: any = {
      // Your API client options
    };

    // Add proxy if enabled
    if (this.proxyConfig.isEnabled()) {
      options.httpAgent = this.proxyConfig.getHttpsAgent();
    }

    // Use options with your HTTP client
    const response = await fetch(url, options);
  }
}
```

## References

- **NestJS Configuration**: https://docs.nestjs.com/techniques/configuration
- **https-proxy-agent**: https://github.com/TooTallNate/proxy-agents
- **OpenAI SDK**: https://github.com/openai/openai-node
- **Orange Platform Documentation**: Contact Orange IT for internal docs

## Support

For issues related to:
- **Proxy configuration**: Check this documentation and troubleshooting section
- **FPC proxy credentials**: Contact Orange IT administrator
- **Application errors**: Check application logs and NestJS documentation
- **Network connectivity**: Contact Orange Platform support

---

**Last Updated:** January 8, 2026  
**Document Version:** 1.0  
**Maintained By:** Development Team
