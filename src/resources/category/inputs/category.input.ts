import { Field, InputType, Int } from '@nestjs/graphql'
import { SelectInput } from 'src/global/inputs/select.input'

@InputType()
export class CategoryInput {
	@Field(() => String)
	name: string

	@Field(() => SelectInput, { nullable: true })
	parent?: SelectInput
}
