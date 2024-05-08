import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Category } from 'src/resources/category/entities/category.entity'
import { Product } from 'src/resources/product/entities/product.entity'
import { Filters } from '../../filters/entities/filters.entity'

@ObjectType()
export class Catalog {
	@Field(() => [Category])
	categories: Category[]

	@Field(() => Category, { nullable: true })
	rootCategory?: Category

	@Field(() => [Product])
	products: Product[]

	@Field(() => Filters)
	filters: Filters

	@Field(() => Int)
	productsCount: number
}
