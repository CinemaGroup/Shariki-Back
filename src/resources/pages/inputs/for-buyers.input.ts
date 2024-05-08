import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ForBuyersInput {
	@Field(() => String)
	name: string

	@Field(() => String)
	content: string
}
