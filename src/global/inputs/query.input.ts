import { Field, InputType } from '@nestjs/graphql'
import { PaginationInput } from 'src/resources/pagination/inputs/pagination.input'
import { Sort, Status } from '../enums/query.enum'

@InputType()
export class QueryInput extends PaginationInput {
	@Field(() => String, { nullable: true })
	readonly searchTerm?: string

	@Field(() => Sort)
	readonly sort: Sort

	@Field(() => Status, { nullable: true })
	readonly status?: Status
}
