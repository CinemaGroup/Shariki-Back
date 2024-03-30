import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { QueryInput } from 'src/global/inputs/query.input'
import { Auth } from '../auth/decorators/auth.decorator'
import { UserRole } from '../user/enums/user-role.enum'
import { CategoryService } from './category.service'
import { Category } from './entities/category.entity'
import { CategoryInput } from './inputs/category.input'

@Resolver()
export class CategoryResolver {
	constructor(private readonly categoryService: CategoryService) {}

	@Query(() => [Category], { name: 'categories' })
	async getAll(@Args('query') input: QueryInput) {
		return this.categoryService.getAll(input)
	}

	// Admin Place
	@Auth(UserRole.ADMIN)
	@Query(() => Category, { name: 'categoryById' })
	async getById(@Args('id', { type: () => Int }) id: number) {
		return this.categoryService.byId(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Category, { name: 'toggleCategory' })
	async togglePublished(@Args('id', { type: () => Int }) id: number) {
		return this.categoryService.togglePublished(id)
	}
	
	@Auth(UserRole.ADMIN)
	@Mutation(() => Category, { name: 'duplicateCategory' })
	async duplicate(@Args('id', { type: () => Int }) id: number) {
		return this.categoryService.duplicate(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Category, { name: 'createCategory' })
	async create() {
		return this.categoryService.create()
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Category, { name: 'updateCategory' })
	async update(
		@Args('id', { type: () => Int }) id: number,
		@Args('data') input: CategoryInput
	) {
		return this.categoryService.update(+id, input)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Category, { name: 'deleteCategory' })
	async delete(@Args('id', { type: () => Int }) id: number) {
		return this.categoryService.delete(id)
	}
}
