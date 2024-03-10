import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { QueryInput } from 'src/global/inputs/query.input'
import { Auth } from '../auth/decorators/auth.decorator'
import { UserRole } from '../user/enums/user-role.enum'
import { Post } from './entities/post.entity'
import { PostInput } from './inputs/post.input'
import { PostService } from './post.service'

@Resolver()
export class PostResolver {
	constructor(private readonly postService: PostService) {}

	@Query(() => [Post], { name: 'posts' })
	async getAll(@Args('query') input: QueryInput) {
		return this.postService.getAll(input)
	}

	// Admin Place

	@Auth(UserRole.ADMIN)
	@Query(() => Post, { name: 'postById' })
	async getById(@Args('id', { type: () => Int }) id: number) {
		return this.postService.byId(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Post, { name: 'togglePost' })
	async togglePublished(@Args('id', { type: () => Int }) id: number) {
		return this.postService.togglePublished(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Post, { name: 'createPost' })
	async create() {
		return this.postService.create()
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Post, { name: 'updatePost' })
	async update(
		@Args('id', { type: () => Int }) id: number,
		@Args('data') input: PostInput
	) {
		return this.postService.update(+id, input)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Post, { name: 'deletePost' })
	async delete(@Args('id', { type: () => Int }) id: number) {
		return this.postService.delete(id)
	}
}
