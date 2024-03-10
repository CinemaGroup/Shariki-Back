import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class TagInput {
	@Field(() => String)
	readonly name: string

	@Field(() => String)
	readonly imagePath: string
}
