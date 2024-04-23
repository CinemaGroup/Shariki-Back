import { Field, InputType } from '@nestjs/graphql'
import { QueryCategoryInput } from 'src/resources/category/inputs/query-category.input'
import { QueryProductInput } from 'src/resources/product/inputs/query-product.input'

@InputType()
export class CatalogInput {
	@Field(() => String, { nullable: true })
	categorySlug?: string

	@Field(() => QueryCategoryInput)
	categoryInput: QueryCategoryInput

	@Field(() => QueryProductInput)
	productInput: QueryProductInput
}
