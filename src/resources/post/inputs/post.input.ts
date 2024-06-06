import { Field, InputType } from '@nestjs/graphql'
import { SelectInput } from 'src/global/inputs/select.input'
import { SeoInput } from 'src/resources/seo/inputs/seo.input'

@InputType()
export class PostInput {
	@Field(() => String)
	name: string

	@Field(() => String)
	excerpt: string

	@Field(() => String)
	description: string

	@Field(() => String)
	poster: string

	@Field(() => String)
	bigPoster: string

	@Field(() => [SelectInput])
	rubrics: SelectInput[]

	@Field(() => SeoInput, { nullable: true })
	seo?: SeoInput
}
