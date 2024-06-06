import { Field, InputType } from '@nestjs/graphql'
import { SelectInput } from 'src/global/inputs/select.input'
import { BlockInput } from 'src/resources/block/inputs/block.input'
import { SeoInput } from 'src/resources/seo/inputs/seo.input'

@InputType()
export class CategoryInput {
	@Field(() => String)
	name: string

	@Field(() => String, { nullable: true })
	imagePath?: string

	@Field(() => SelectInput, { nullable: true })
	parent?: SelectInput

	@Field(() => SeoInput, { nullable: true })
	seo?: SeoInput

	@Field(() => BlockInput, { nullable: true })
	block?: BlockInput
}
