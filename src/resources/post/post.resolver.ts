import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { QueryInput } from 'src/global/inputs/query.input'
import { Auth } from '../auth/decorators/auth.decorator'
import { Seo } from '../seo/entities/seo.entity'
import { UserRole } from '../user/enums/user-role.enum'
import { AllPosts, Post } from './entities/post.entity'
import { PostInput } from './inputs/post.input'
import { PostService } from './post.service'

@Resolver()
export class PostResolver {
	constructor(private readonly postService: PostService) {}

	@Query(() => AllPosts, { name: 'posts' })
	async getAll(@Args('query') input: QueryInput) {
		return this.postService.getAll(input)
	}

	@Query(() => Seo, { name: 'postSeo', nullable: true })
	async getSeo(@Args('slug') slug: string) {
		return this.postService.getSeo(slug)
	}

	@Auth(UserRole.ADMIN)
	@Query(() => Post, { name: 'postBySlug' })
	async getBySlug(@Args('slug', { type: () => String }) slug: string) {
		return this.postService.bySlug(slug)
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
	@Mutation(() => Post, { name: 'duplicatePost' })
	async duplicate(@Args('id', { type: () => Int }) id: number) {
		return this.postService.duplicate(id)
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
