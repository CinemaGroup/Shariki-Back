import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { Product } from '../../entities/product.entity'

@ObjectType()
export class Size {
	@Field(() => Int)
	id: number

	@Field(() => String)
	size: string

	@Field(() => String)
	price: string

	@Field(() => String, { nullable: true })
	oldPrice?: string

	@Field(() => Product)
	product: Product

	@Field(() => Int)
	productId: number

	@Field(() => Date)
	updatedAt: Date

	@Field(() => Date)
	createdAt: Date
}
