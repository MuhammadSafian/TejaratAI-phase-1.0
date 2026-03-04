import { Module, MiddlewareConsumer, NestModule, Get, Controller } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VaultModule } from './vault/vault.module';
import { PlatformsModule } from './platforms/platforms.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';

@Controller('health')
export class HealthController {
    @Get()
    check() {
        return { status: 'ok', service: 'tijarat-gateway' };
    }
}

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        UsersModule,
        VaultModule,
        PlatformsModule,
        WebhooksModule,
    ],
    controllers: [HealthController],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RateLimitMiddleware).forRoutes('*');
    }
}
