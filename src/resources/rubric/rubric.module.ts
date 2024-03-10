import { Module } from '@nestjs/common';
import { RubricService } from './rubric.service';
import { RubricResolver } from './rubric.resolver';

@Module({
  providers: [RubricResolver, RubricService],
})
export class RubricModule {}
