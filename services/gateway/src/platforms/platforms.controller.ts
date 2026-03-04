import { Controller, Get, Query, Res, Req, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import axios from 'axios';
import { VaultService } from '../vault/vault.service';

@Controller('shopify')
export class ShopifyController {
    constructor(
        private configService: ConfigService,
        private vaultService: VaultService,
    ) { }

    @Get('install')
    install(@Query('shop') shop: string, @Res() res: Response) {
        if (!shop) {
            throw new HttpException('Missing shop parameter', HttpStatus.BAD_REQUEST);
        }

        const apiKey = this.configService.get<string>('SHOPIFY_API_KEY');
        const appUrl = this.configService.get<string>('APP_URL');
        const scopes = 'read_orders,read_products,read_inventory,write_inventory';
        const redirectUri = `${appUrl}/api/shopify/callback`;
        const nonce = Math.random().toString(36).substring(7);

        const installUrl =
            `https://${shop}/admin/oauth/authorize?` +
            `client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}&state=${nonce}`;

        return res.redirect(installUrl);
    }

    @Get('callback')
    async callback(
        @Query('code') code: string,
        @Query('shop') shop: string,
        @Query('hmac') hmac: string,
        @Res() res: Response,
    ) {
        if (!code || !shop) {
            throw new HttpException('Missing code or shop', HttpStatus.BAD_REQUEST);
        }

        // TODO: Verify HMAC signature before exchanging code

        const apiKey = this.configService.get<string>('SHOPIFY_API_KEY');
        const apiSecret = this.configService.get<string>('SHOPIFY_API_SECRET');

        try {
            const response = await axios.post(`https://${shop}/admin/oauth/access_token`, {
                client_id: apiKey,
                client_secret: apiSecret,
                code,
            });

            const accessToken = response.data.access_token;

            // Encrypt and store the token securely
            const encrypted = this.vaultService.encrypt(
                JSON.stringify({ access_token: accessToken, shop }),
            );

            // TODO: Save encrypted token to platform_tokens table

            return res.json({ success: true, message: 'Shopify connected successfully!' });
        } catch (error) {
            throw new HttpException('Failed to exchange Shopify token', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

@Controller('daraz')
export class DarazController {
    constructor(private configService: ConfigService) { }

    @Get('connect')
    connect(@Res() res: Response) {
        const appKey = this.configService.get<string>('DARAZ_APP_KEY');
        const appUrl = this.configService.get<string>('APP_URL');
        const redirectUri = `${appUrl}/api/daraz/callback`;
        const authUrl = `https://auth.daraz.pk/oauth/authorize?response_type=code&client_id=${appKey}&redirect_uri=${redirectUri}&force_auth=true`;
        return res.redirect(authUrl);
    }

    @Get('callback')
    async callback(@Query('code') code: string, @Res() res: Response) {
        if (!code) {
            throw new HttpException('Missing authorization code', HttpStatus.BAD_REQUEST);
        }
        // TODO: Exchange code for Daraz access token via /rest/auth/token/create
        return res.json({ success: true, message: 'Daraz connected!' });
    }
}
