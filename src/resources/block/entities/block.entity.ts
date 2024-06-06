import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Block {
	@Field(() => String)
	heading: string

	@Field(() => String)
	content: string
}
