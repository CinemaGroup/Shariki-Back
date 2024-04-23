import { Args, Query, Resolver } from '@nestjs/graphql'
import { CatalogService } from './catalog.service'
import { Catalog } from './entities/catalog.entity'
import { CatalogInput } from './inputs/catalog.input'

@Resolver()
export class CatalogResolver {
	constructor(private readonly catalogService: CatalogService) {}

	@Query(() => Catalog, { name: 'catalog' })
	async getCatalog(@Args('data') input: CatalogInput) {
		return this.catalogService.getCatalog(input)
	}
}
