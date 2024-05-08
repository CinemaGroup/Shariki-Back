import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class RubricInput {
	@Field(() => String)
	name: string
}
