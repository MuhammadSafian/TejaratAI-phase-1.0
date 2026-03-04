import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Controller('auth/otp')
export class OtpController {
    constructor(private configService: ConfigService) { }

    @Post('send')
    async sendOtp(@Body('phone') phone: string) {
        if (!phone || phone.length < 10) {
            throw new HttpException('Valid phone number required', HttpStatus.BAD_REQUEST);
        }

        const aiCoreUrl = this.configService.get<string>('AI_CORE_URL') || 'http://tijarat-ai-core:8000';

        try {
            const res = await axios.post(`${aiCoreUrl}/api/v1/auth/send-otp`, { phone });
            return res.data;
        } catch (error) {
            if (error.response?.status === 429) {
                throw new HttpException('Too many OTP requests. Try after 1 hour.', HttpStatus.TOO_MANY_REQUESTS);
            }
            throw new HttpException('Failed to send OTP', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('verify')
    async verifyOtp(@Body() body: { phone: string; otp: string }) {
        if (!body.phone || !body.otp) {
            throw new HttpException('Phone and OTP required', HttpStatus.BAD_REQUEST);
        }

        const aiCoreUrl = this.configService.get<string>('AI_CORE_URL') || 'http://tijarat-ai-core:8000';

        try {
            const res = await axios.post(`${aiCoreUrl}/api/v1/auth/verify-otp`, {
                phone: body.phone,
                otp: body.otp,
            });
            return res.data;
        } catch (error) {
            throw new HttpException(
                error.response?.data?.detail || 'OTP verification failed',
                error.response?.status || HttpStatus.BAD_REQUEST,
            );
        }
    }
}
