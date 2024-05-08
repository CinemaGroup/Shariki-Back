import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { QueryInput } from 'src/global/inputs/query.input'
import { Auth } from '../auth/decorators/auth.decorator'
import { UserRole } from '../user/enums/user-role.enum'
import { Review } from './entities/review.entity'
import { ReviewInput } from './inputs/review.input'
import { ReviewService } from './review.service'

@Resolver()
export class ReviewResolver {
	constructor(private readonly reviewService: ReviewService) {}

	@Query(() => [Review], { name: 'reviews' })
	async getAll(@Args('query') input: QueryInput) {
		return this.reviewService.getAll(input)
	}

	// Admin Place

	@Auth(UserRole.ADMIN)
	@Query(() => Review, { name: 'reviewById' })
	async getById(@Args('id', { type: () => Int }) id: number) {
		return this.reviewService.byId(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Review, { name: 'toggleReview' })
	async togglePublished(@Args('id', { type: () => Int }) id: number) {
		return this.reviewService.togglePublished(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Review, { name: 'duplicateReview' })
	async duplicate(@Args('id', { type: () => Int }) id: number) {
		return this.reviewService.duplicate(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Review, { name: 'createReview' })
	async create() {
		return this.reviewService.create()
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Review, { name: 'updateReview' })
	async update(
		@Args('id', { type: () => Int }) id: number,
		@Args('data') input: ReviewInput
	) {
		return this.reviewService.update(+id, input)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Review, { name: 'deleteReview' })
	async delete(@Args('id', { type: () => Int }) id: number) {
		return this.reviewService.delete(id)
	}
}
