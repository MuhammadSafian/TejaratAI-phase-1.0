import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOAuthController } from './google-oauth.controller';
import { OtpController } from './otp.controller';

@Module({
    controllers: [GoogleOAuthController, OtpController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule { }
