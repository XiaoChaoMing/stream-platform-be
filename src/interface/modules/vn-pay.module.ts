import { Module } from '@nestjs/common';
import { VnpayController } from '../controllers/vn-pay.controller';
import { VnpayService } from '../../infrastructure/vn-pay/vn-pay.service';
import { ConfigModule } from '@nestjs/config';
import vnpayConfig from '../../infrastructure/vn-pay/vn-pay.config';

@Module({
  imports: [
    ConfigModule.forFeature(vnpayConfig)
  ],
  controllers: [VnpayController],
  providers: [
    VnpayService
  ],
  exports: [VnpayService],
})
export class VnPayModule {}