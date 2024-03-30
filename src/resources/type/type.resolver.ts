import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { QueryInput } from 'src/global/inputs/query.input'
import { Auth } from '../auth/decorators/auth.decorator'
import { UserRole } from '../user/enums/user-role.enum'
import { Type } from './entities/type.entity'
import { TypeInput } from './inputs/type.input'
import { TypeService } from './type.service'

@Resolver()
export class TypeResolver {
	constructor(private readonly typeService: TypeService) {}

	@Query(() => [Type], { name: 'types' })
	async getAll(@Args('query') input: QueryInput) {
		return this.typeService.getAll(input)
	}

	// Admin Place
	@Auth(UserRole.ADMIN)
	@Query(() => Type, { name: 'typeById' })
	async getById(@Args('id', { type: () => Int }) id: number) {
		return this.typeService.byId(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Type, { name: 'toggleType' })
	async togglePublished(@Args('id', { type: () => Int }) id: number) {
		return this.typeService.togglePublished(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Type, { name: 'duplicateType' })
	async duplicate(@Args('id', { type: () => Int }) id: number) {
		return this.typeService.duplicate(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Type, { name: 'createType' })
	async create() {
		return this.typeService.create()
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Type, { name: 'updateType' })
	async update(
		@Args('id', { type: () => Int }) id: number,
		@Args('data') input: TypeInput
	) {
		return this.typeService.update(+id, input)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Type, { name: 'deleteType' })
	async delete(@Args('id', { type: () => Int }) id: number) {
		return this.typeService.delete(id)
	}
}
