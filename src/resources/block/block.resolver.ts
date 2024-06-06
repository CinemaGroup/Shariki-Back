import { Resolver } from '@nestjs/graphql';
import { BlockService } from './block.service';

@Resolver()
export class BlockResolver {
  constructor(private readonly blockService: BlockService) {}
}
