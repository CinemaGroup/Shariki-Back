import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class PaginationInput {
	@Field(() => String, { nullable: true })
	readonly page?: string | null

	@Field(() => String, { nullable: true })
	readonly perPage?: string | null
}
