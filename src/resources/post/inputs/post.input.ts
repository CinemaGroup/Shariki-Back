import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class PostInput {
	@Field(() => String)
	name: string

	@Field(() => String)
	excerpt: string

	@Field(() => String)
	description: string

	@Field(() => String)
	poster: string

	@Field(() => String)
	bigPoster: string

	@Field(() => [Int])
	rubrics: number[]
}
