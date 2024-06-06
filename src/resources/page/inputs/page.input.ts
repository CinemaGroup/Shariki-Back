import { Field, InputType } from '@nestjs/graphql'
import { BlockInput } from 'src/resources/block/inputs/block.input'
import { SeoInput } from 'src/resources/seo/inputs/seo.input'

@InputType()
export class PageInput {
	@Field(() => [BlockInput], { nullable: true })
	blocks?: BlockInput[]

	@Field(() => SeoInput, { nullable: true })
	seo?: SeoInput
}
