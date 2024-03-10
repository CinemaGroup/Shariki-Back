import { Resolver } from '@nestjs/graphql';
import { TypeService } from './type.service';

@Resolver()
export class TypeResolver {
  constructor(private readonly typeService: TypeService) {}
}
