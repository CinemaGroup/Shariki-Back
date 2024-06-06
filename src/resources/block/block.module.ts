import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockResolver } from './block.resolver';

@Module({
  providers: [BlockResolver, BlockService],
})
export class BlockModule {}
