import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SizeInput {
	@Field(() => String)
	size: string

	@Field(() => String)
	price: string

	@Field(() => String, { nullable: true })
	oldPrice?: string
}
