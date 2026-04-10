import { Module } from '@nestjs/common';
import { EmessService } from './emess.service';

@Module({
  providers: [EmessService],
  exports: [EmessService],
})
export class EmessModule {}
