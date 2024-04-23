import { Field, InputType } from '@nestjs/graphql'
import { QueryInput } from 'src/global/inputs/query.input'

@InputType()
export class QueryCategoryInput extends QueryInput {
	@Field(() => Boolean, { nullable: true })
	isParents?: boolean
}
