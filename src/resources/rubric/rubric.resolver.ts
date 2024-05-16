import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { QueryInput } from 'src/global/inputs/query.input'
import { Auth } from '../auth/decorators/auth.decorator'
import { UserRole } from '../user/enums/user-role.enum'
import { AllRubrics, Rubric } from './entities/rubric.entity'
import { RubricInput } from './inputs/rubric.input'
import { RubricService } from './rubric.service'

@Resolver()
export class RubricResolver {
	constructor(private readonly rubricService: RubricService) {}

	@Query(() => AllRubrics, { name: 'rubrics' })
	async getAll(@Args('query') input: QueryInput) {
		return this.rubricService.getAll(input)
	}

	// Admin Place

	@Auth(UserRole.ADMIN)
	@Query(() => Rubric, { name: 'rubricById' })
	async getById(@Args('id', { type: () => Int }) id: number) {
		return this.rubricService.byId(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Rubric, { name: 'toggleRubric' })
	async togglePublished(@Args('id', { type: () => Int }) id: number) {
		return this.rubricService.togglePublished(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Rubric, { name: 'duplicateRubric' })
	async duplicate(@Args('id', { type: () => Int }) id: number) {
		return this.rubricService.duplicate(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Rubric, { name: 'createRubric' })
	async create() {
		return this.rubricService.create()
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Rubric, { name: 'updateRubric' })
	async update(
		@Args('id', { type: () => Int }) id: number,
		@Args('data') input: RubricInput
	) {
		return this.rubricService.update(+id, input)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Rubric, { name: 'deleteRubric' })
	async delete(@Args('id', { type: () => Int }) id: number) {
		return this.rubricService.delete(id)
	}
}
