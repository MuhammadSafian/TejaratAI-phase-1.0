import { Module } from '@nestjs/common';
import { ShopifyController, DarazController } from './platforms.controller';
import { VaultModule } from '../vault/vault.module';

@Module({
    imports: [VaultModule],
    controllers: [ShopifyController, DarazController],
})
export class PlatformsModule { }
