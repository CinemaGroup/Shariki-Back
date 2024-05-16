import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Status } from 'src/global/enums/query.enum'
import { Post } from 'src/resources/post/entities/post.entity'

@ObjectType()
export class Rubric {
	@Field(() => Int)
	id: number

	@Field(() => String)
	name: string

	@Field(() => String)
	slug: string

	@Field(() => [Post])
	posts: Post[]

	@Field(() => Status)
	status: Status

	@Field(() => Date)
	updatedAt: Date

	@Field(() => Date)
	createdAt: Date
}

@ObjectType()
export class AllRubrics {
	@Field(() => [Rubric])
	rubrics: Rubric[]

	@Field(() => Int)
	count: number
}
