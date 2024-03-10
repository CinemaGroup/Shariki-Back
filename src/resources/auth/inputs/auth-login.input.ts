import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class AuthLoginInput {
	@Field()
	readonly loginOrEmail: string

	@Field()
	readonly password: string
}
