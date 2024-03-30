import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { QueryInput } from 'src/global/inputs/query.input'
import { Auth } from '../auth/decorators/auth.decorator'
import { UserRole } from '../user/enums/user-role.enum'
import { Tag } from './entities/tag.entity'
import { TagInput } from './inputs/tag.input'
import { TagService } from './tag.service'

@Resolver()
export class TagResolver {
	constructor(private readonly tagService: TagService) {}

	@Query(() => [Tag], { name: 'tags' })
	async getAll(@Args('query') input: QueryInput) {
		return this.tagService.getAll(input)
	}

	// Admin Place

	@Auth(UserRole.ADMIN)
	@Query(() => Tag, { name: 'tagById' })
	async getById(@Args('id', { type: () => Int }) id: number) {
		return this.tagService.byId(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Tag, { name: 'toggleTag' })
	async togglePublished(@Args('id', { type: () => Int }) id: number) {
		return this.tagService.togglePublished(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Tag, { name: 'duplicateTag' })
	async duplicate(@Args('id', { type: () => Int }) id: number) {
		return this.tagService.duplicate(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Tag, { name: 'createTag' })
	async create() {
		return this.tagService.create()
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Tag, { name: 'updateTag' })
	async update(
		@Args('id', { type: () => Int }) id: number,
		@Args('data') input: TagInput
	) {
		return this.tagService.update(+id, input)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Tag, { name: 'deleteTag' })
	async delete(@Args('id', { type: () => Int }) id: number) {
		return this.tagService.delete(id)
	}
}
