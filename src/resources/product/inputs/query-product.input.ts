import { Field, InputType } from '@nestjs/graphql'
import { QueryInput } from 'src/global/inputs/query.input'

@InputType()
export class QueryProductInput extends QueryInput {
	@Field(() => [String], { nullable: true })
	sizes?: string[]

	@Field(() => [String], { nullable: true })
	colors?: string[]

	@Field(() => [String], { nullable: true })
	hues?: string[]

	@Field(() => [String], { nullable: true })
	types?: string[]

	@Field(() => [String], { nullable: true })
	manufacturers?: string[]

	@Field(() => [String], { nullable: true })
	materials?: string[]

	@Field(() => [String], { nullable: true })
	collections?: string[]

	@Field(() => [String], { nullable: true })
	holidays?: string[]

	@Field(() => [String], { nullable: true })
	countries?: string[]

	@Field(() => [String], { nullable: true })
	tags?: string[]

	@Field(() => String, { nullable: true })
	min?: string

	@Field(() => String, { nullable: true })
	max?: string
}
