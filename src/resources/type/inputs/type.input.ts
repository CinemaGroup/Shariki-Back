import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class TypeInput {
	@Field(() => String)
	name: string

	@Field(() => String)
	iconPath: string
}
