import { Resolver } from '@nestjs/graphql';
import { CollectionService } from './collection.service';

@Resolver()
export class CollectionResolver {
  constructor(private readonly collectionService: CollectionService) {}
}
