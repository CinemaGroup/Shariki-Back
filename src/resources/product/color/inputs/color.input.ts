import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ColorInput {
	@Field(() => String)
	color: string

	@Field(() => [String])
	images: string[]
}
