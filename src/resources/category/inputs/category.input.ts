import { Field, InputType } from '@nestjs/graphql'
import { SelectInput } from 'src/global/inputs/select.input'

@InputType()
export class CategoryInput {
	@Field(() => String)
	name: string

	@Field(() => String, { nullable: true })
	imagePath?: string

	@Field(() => SelectInput, { nullable: true })
	parent?: SelectInput
}
