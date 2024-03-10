import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class AuthRegisterInput {
	@Field()
	readonly login: string

	@Field()
	readonly email: string

	@Field()
	readonly password: string
}
