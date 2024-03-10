import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ReviewInput {
	@Field(() => String)
	author: string

	@Field(() => String)
	content: string

	@Field(() => String)
	photo: string
}
