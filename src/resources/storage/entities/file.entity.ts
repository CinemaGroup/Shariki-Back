import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class File {
	@Field(() => String)
	name: string

	@Field(() => String)
	size: string

	@Field(() => String)
	extension: string

	@Field(() => String)
	path: string

	@Field(() => Date)
	createdAt: Date
}
