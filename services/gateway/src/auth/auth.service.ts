import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.userId };
        // This requires RSA keys in a real environment as parsed in the blueprint.
        // Simplifying for basic scaffolding.
        const secret = process.env.JWT_PRIVATE_KEY_PATH || 'secret';
        return {
            access_token: jwt.sign(payload, secret, { expiresIn: '15m' }),
        };
    }
}
