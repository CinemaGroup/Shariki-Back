import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class HolidayInput {
	@Field(() => String)
	name: string

	@Field(() => String)
	imagePath: string
}
