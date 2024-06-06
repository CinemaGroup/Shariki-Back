import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from '../auth/decorators/auth.decorator'
import { Seo } from '../seo/entities/seo.entity'
import { UserRole } from '../user/enums/user-role.enum'
import { CategoryService } from './category.service'
import { AllCategories, Category } from './entities/category.entity'
import { CategoryInput } from './inputs/category.input'
import { QueryCategoryInput } from './inputs/query-category.input'

@Resolver()
export class CategoryResolver {
	constructor(private readonly categoryService: CategoryService) {}

	@Query(() => AllCategories, { name: 'categories' })
	async getAll(@Args('query') input: QueryCategoryInput) {
		return this.categoryService.getAll(input)
	}

	@Query(() => Seo, { name: 'categorySeo', nullable: true })
	async getSeo(@Args('slug') slug: string) {
		return this.categoryService.getSeo(slug)
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
