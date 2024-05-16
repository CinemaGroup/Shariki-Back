import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { QueryInput } from 'src/global/inputs/query.input'
import { Auth } from '../auth/decorators/auth.decorator'
import { UserRole } from '../user/enums/user-role.enum'
import { CollectionService } from './collection.service'
import { AllCollections, Collection } from './entities/collection.entity'
import { CollectionInput } from './inputs/collection.input'

@Resolver()
export class CollectionResolver {
	constructor(private readonly collectionService: CollectionService) {}

	@Query(() => AllCollections, { name: 'collections' })
	async getAll(@Args('query') input: QueryInput) {
		return this.collectionService.getAll(input)
	}

	// Admin Place

	@Auth(UserRole.ADMIN)
	@Query(() => Collection, { name: 'collectionById' })
	async getById(@Args('id', { type: () => Int }) id: number) {
		return this.collectionService.byId(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Collection, { name: 'toggleCollection' })
	async togglePublished(@Args('id', { type: () => Int }) id: number) {
		return this.collectionService.togglePublished(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Collection, { name: 'duplicateCollection' })
	async duplicate(@Args('id', { type: () => Int }) id: number) {
		return this.collectionService.duplicate(id)
	}

	// @Auth(UserRole.ADMIN)
	@Mutation(() => Collection, { name: 'createCollection' })
	async create() {
		return this.collectionService.create()
	}

	// @Auth(UserRole.ADMIN)
	@Mutation(() => Collection, { name: 'updateCollection' })
	async update(
		@Args('id', { type: () => Int }) id: number,
		@Args('data') input: CollectionInput
	) {
		return this.collectionService.update(+id, input)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Collection, { name: 'deleteCollection' })
	async delete(@Args('id', { type: () => Int }) id: number) {
		return this.collectionService.delete(id)
	}
}
