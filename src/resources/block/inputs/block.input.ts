import { Field, InputType } from '@nestjs/graphql'
import { BlockType } from '../enums/block-type.enum'

@InputType()
export class BlockInput {
	@Field(() => String)
	heading: string

	@Field(() => String)
	content: string

	@Field(() => BlockType, { nullable: true })
	type?: BlockType
}
