import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class About {
	@Field(() => String)
	name: string

	@Field(() => String)
	content: string
}
