import { Controller, Get, Query, Res, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import axios from 'axios';

@Controller('auth/google')
export class GoogleOAuthController {
    constructor(private configService: ConfigService) { }

    @Get('login')
    login(@Res() res: Response) {
        const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
        const appUrl = this.configService.get<string>('APP_URL');
        const redirectUri = `${appUrl}/api/auth/google/callback`;

        const scopes = ['openid', 'email', 'profile'].join(' ');
        const authUrl =
            `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${clientId}&redirect_uri=${redirectUri}` +
            `&response_type=code&scope=${scopes}&access_type=offline&prompt=consent`;

        return res.redirect(authUrl);
    }

    @Get('callback')
    async callback(@Query('code') code: string, @Res() res: Response) {
        if (!code) {
            throw new HttpException('Missing authorization code', HttpStatus.BAD_REQUEST);
        }

        const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
        const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
        const appUrl = this.configService.get<string>('APP_URL');
        const redirectUri = `${appUrl}/api/auth/google/callback`;

        try {
            // Exchange code for tokens
            const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            });

            const { id_token, access_token } = tokenRes.data;

            // Verify and decode ID token
            const userInfoRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${access_token}` },
            });

            const { email, name, sub: googleId, picture } = userInfoRes.data;

            // Forward to AI Core to create/find seller
            const aiCoreUrl = this.configService.get<string>('AI_CORE_URL') || 'http://tijarat-ai-core:8000';
            const sellerRes = await axios.post(`${aiCoreUrl}/api/v1/auth/google-login`, {
                email,
                name,
                google_id: googleId,
                picture,
            });

            const { jwt_token, seller_id } = sellerRes.data;

            // Redirect to dashboard with token
            const dashboardUrl = this.configService.get<string>('DASHBOARD_URL') || appUrl;
            return res.redirect(`${dashboardUrl}/auth/callback?token=${jwt_token}&seller=${seller_id}`);

        } catch (error) {
            throw new HttpException(
                `Google OAuth failed: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
