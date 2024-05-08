import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class AboutInput {
	@Field(() => String)
	name: string

	@Field(() => String)
	content: string
}
