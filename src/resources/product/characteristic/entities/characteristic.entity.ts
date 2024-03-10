import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Product } from '../../entities/product.entity'

@ObjectType()
export class Characteristic {
	@Field(() => Int)
	id: number

	@Field(() => String)
	name: string

	@Field(() => String)
	value: string

	@Field(() => Product)
	product: Product

	@Field(() => Int)
	productId: number

	@Field(() => Date)
	updatedAt: Date

	@Field(() => Date)
	createdAt: Date
}
