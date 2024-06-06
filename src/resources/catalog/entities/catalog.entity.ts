import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Block } from 'src/resources/block/entities/block.entity'
import { Category } from 'src/resources/category/entities/category.entity'
import { Product } from 'src/resources/product/entities/product.entity'
import { Seo } from 'src/resources/seo/entities/seo.entity'
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

	@Field(() => Block, { nullable: true })
	block?: Block
}
