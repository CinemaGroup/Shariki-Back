import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class SelectInput {
	@Field(() => Int)
	value: number

	@Field(() => String)
	name: string
}
