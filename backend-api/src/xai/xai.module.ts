import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { XaiService } from './xai.service.js';

@Module({
  imports: [ConfigModule],
  providers: [XaiService],
  exports: [XaiService],
})
export class XaiModule {}
