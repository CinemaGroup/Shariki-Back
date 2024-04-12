import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CollectionInput {
	@Field(() => String)
	name: string
}
