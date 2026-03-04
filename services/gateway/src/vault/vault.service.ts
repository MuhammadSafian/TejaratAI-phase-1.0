import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class VaultService {
    private readonly algorithm = 'aes-256-gcm';
    private readonly masterKey: Buffer;

    constructor(private configService: ConfigService) {
        const key = this.configService.get<string>('VAULT_MASTER_KEY') || 'dummy-master-key-which-is-32-chars-long';
        // Ensure key is 32 bytes
        this.masterKey = crypto.createHash('sha256').update(key).digest();
    }

    encrypt(text: string): { ciphertext: string; iv: string; authTag: string } {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv(this.algorithm, this.masterKey, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();

        return {
            ciphertext: encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex'),
        };
    }

    decrypt(encrypted: { ciphertext: string; iv: string; authTag: string }): string {
        const iv = Buffer.from(encrypted.iv, 'hex');
        const authTag = Buffer.from(encrypted.authTag, 'hex');
        const decipher = crypto.createDecipheriv(this.algorithm, this.masterKey, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encrypted.ciphertext, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
