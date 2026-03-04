import { Controller, Post, Body, Headers, HttpException, HttpStatus, RawBodyRequest, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as crypto from 'crypto';
import axios from 'axios';

@Controller('webhooks')
export class WebhooksController {
    constructor(private configService: ConfigService) { }

    @Post('shopify/orders')
    async handleShopifyOrder(
        @Body() body: any,
        @Headers('x-shopify-hmac-sha256') hmac: string,
        @Req() req: RawBodyRequest<Request>,
    ) {
        // Verify HMAC
        const secret = this.configService.get<string>('SHOPIFY_API_SECRET');
        if (secret && req.rawBody) {
            const calculatedHmac = crypto
                .createHmac('sha256', secret)
                .update(req.rawBody)
                .digest('base64');

            if (calculatedHmac !== hmac) {
                throw new HttpException('Invalid HMAC', HttpStatus.UNAUTHORIZED);
            }
        }

        // Forward to AI Core for processing
        const aiCoreUrl = this.configService.get<string>('AI_CORE_URL') || 'http://tijarat-ai-core:8000';
        try {
            await axios.post(`${aiCoreUrl}/api/v1/process-order`, {
                platform: 'shopify',
                order_data: body,
            });
        } catch (error) {
            console.error('Failed to forward webhook to AI Core:', error.message);
        }

        return { received: true };
    }

    @Post('daraz/orders')
    async handleDarazOrder(@Body() body: any) {
        const aiCoreUrl = this.configService.get<string>('AI_CORE_URL') || 'http://tijarat-ai-core:8000';
        try {
            await axios.post(`${aiCoreUrl}/api/v1/process-order`, {
                platform: 'daraz',
                order_data: body,
            });
        } catch (error) {
            console.error('Failed to forward Daraz webhook to AI Core:', error.message);
        }
        return { received: true };
    }

    @Post('courier/status')
    async handleCourierStatus(@Body() body: any) {
        const aiCoreUrl = this.configService.get<string>('AI_CORE_URL') || 'http://tijarat-ai-core:8000';
        try {
            await axios.post(`${aiCoreUrl}/api/v1/shipment-update`, body);
        } catch (error) {
            console.error('Failed to forward courier update:', error.message);
        }
        return { received: true };
    }
}
