import { Field, ObjectType } from '@nestjs/graphql'
import { Block } from 'src/resources/block/entities/block.entity'
import { Seo } from 'src/resources/seo/entities/seo.entity'

@ObjectType()
export class Page {
	@Field(() => [Block], { nullable: true })
	blocks?: Block[]

	@Field(() => Seo, { nullable: true })
	seo?: Seo
}
