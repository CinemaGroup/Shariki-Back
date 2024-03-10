import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Status } from 'src/global/enums/query.enum'
import { Product } from 'src/resources/product/entities/product.entity'

@ObjectType()
export class Category {
	@Field(() => Int)
	id: number

	@Field(() => String)
	name: string

	@Field(() => String)
	slug: string

	@Field(() => [Product])
	products: Product[]

	@Field(() => [Category])
	categories: Category[]

	@Field(() => Category, { nullable: true })
	parent?: Category

	@Field(() => Int, { nullable: true })
	parentId?: number

	@Field(() => Status)
	status: Status

	@Field(() => Date)
	updatedAt: Date

	@Field(() => Date)
	createdAt: Date
}
