import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ForBuyers {
	@Field(() => String)
	name: string

	@Field(() => String)
	content: string
}
