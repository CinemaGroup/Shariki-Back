import { Resolver } from '@nestjs/graphql';
import { RubricService } from './rubric.service';

@Resolver()
export class RubricResolver {
  constructor(private readonly rubricService: RubricService) {}
}
