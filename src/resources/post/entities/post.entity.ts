import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Status } from 'src/global/enums/query.enum'
import { Rubric } from 'src/resources/rubric/entities/rubric.entity'

@ObjectType()
export class Post {
	@Field(() => Int)
	id: number

	@Field(() => String)
	name: string

	@Field(() => String)
	slug: string

	@Field(() => String)
	excerpt: string

	@Field(() => String)
	description: string

	@Field(() => String)
	poster: string

	@Field(() => String)
	bigPoster: string

	@Field(() => [Rubric])
	rubrics: Rubric[]

	@Field(() => Status)
	status: Status

	@Field(() => Date)
	updatedAt: Date

	@Field(() => Date)
	createdAt: Date
}
