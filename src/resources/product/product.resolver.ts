import { Args, Query, Resolver } from '@nestjs/graphql'
import { Product } from './entities/product.entity'
import { QueryProductInput } from './inputs/query-product.input'
import { ProductService } from './product.service'

@Resolver()
export class ProductResolver {
	constructor(private readonly productService: ProductService) {}

	@Query(() => [Product], { name: 'products' })
	async getAll(@Args('query') input: QueryProductInput) {
		return this.productService.getAll(input)
	}
}
