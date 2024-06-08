import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class MailInput {
	@Field(() => String)
	email: string

	@Field(() => String)
	subject: string

	@Field(() => String)
	html: string
}

@InputType()
export class CallRequestInput {
	@Field(() => String)
	name: string

	@Field(() => String)
	phone: string
}

