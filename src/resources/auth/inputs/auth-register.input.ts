import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class AuthRegisterInput {
	@Field(() => String)
	readonly login: string

	@Field(() => String)
	readonly email: string

	@Field(() => String)
	readonly password: string
}
