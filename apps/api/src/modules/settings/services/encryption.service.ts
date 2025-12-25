import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 16;
  private readonly tagLength = 16;
  private readonly saltLength = 64;
  private readonly key: Buffer;

  constructor() {
    const secret = process.env.ENCRYPTION_KEY || 'default-encryption-key-please-change-in-production';
    
    // Derive a key from the secret using scrypt
    const salt = Buffer.from(process.env.ENCRYPTION_SALT || 'default-salt-change-me');
    this.key = scryptSync(secret, salt, this.keyLength);
  }

  /**
   * Encrypt a string value
   */
  encrypt(value: string): string {
    if (!value) return value;

    const iv = randomBytes(this.ivLength);
    const cipher = createCipheriv(this.algorithm, this.key, iv);

    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    // Return format: iv:tag:encrypted
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypt a string value
   */
  decrypt(encrypted: string): string {
    if (!encrypted) return encrypted;

    const parts = encrypted.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted value format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const tag = Buffer.from(parts[1], 'hex');
    const encryptedText = parts[2];

    const decipher = createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
