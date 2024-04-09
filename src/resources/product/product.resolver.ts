import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from '../auth/decorators/auth.decorator'
import { UserRole } from '../user/enums/user-role.enum'
import { CurrentProduct, Product } from './entities/product.entity'
import { ProductInput } from './inputs/product.input'
import { QueryProductInput } from './inputs/query-product.input'
import { ProductService } from './product.service'

@Resolver()
export class ProductResolver {
	constructor(private readonly productService: ProductService) {}

	@Query(() => [Product], { name: 'products' })
	async getAll(
		@Args('query') input: QueryProductInput,
		@Args('isSale', { type: () => Boolean, nullable: true }) isSale?: boolean
	) {
		return this.productService.getAll(input, isSale)
	}

	@Query(() => CurrentProduct, { name: 'productBySlug' })
	async getBySlug(@Args('slug') slug: string) {
		return this.productService.bySlug(slug)
	}

	// Admin Place
	@Auth(UserRole.ADMIN)
	@Query(() => Product, { name: 'productById' })
	async getById(@Args('id', { type: () => Int }) id: number) {
		return this.productService.byId(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Product, { name: 'toggleProduct' })
	async togglePublished(@Args('id', { type: () => Int }) id: number) {
		return this.productService.togglePublished(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Product, { name: 'duplicateProduct' })
	async duplicate(@Args('id', { type: () => Int }) id: number) {
		return this.productService.duplicate(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Product, { name: 'createProduct' })
	async create() {
		return this.productService.create()
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Product, { name: 'updateProduct' })
	async update(
		@Args('id', { type: () => Int }) id: number,
		@Args('data') input: ProductInput
	) {
		return this.productService.update(+id, input)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Product, { name: 'deleteProduct' })
	async delete(@Args('id', { type: () => Int }) id: number) {
		return this.productService.delete(id)
	}
}
