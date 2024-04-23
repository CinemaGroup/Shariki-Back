import { Resolver } from '@nestjs/graphql';
import { FiltersService } from './filters.service';

@Resolver()
export class FiltersResolver {
  constructor(private readonly filtersService: FiltersService) {}
}
