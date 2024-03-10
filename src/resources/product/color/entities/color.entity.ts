import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { Product } from '../../entities/product.entity'

@ObjectType()
export class Color {
	@Field(() => Int)
	id: number

	@Field(() => String)
	color: string

	@Field(() => Float)
	price: Float32Array

	@Field(() => Float, { nullable: true })
	oldPrice?: Float32Array

	@Field(() => Product)
	product: Product

	@Field(() => Int)
  productId: number

	@Field(() => Date)
	updatedAt: Date

	@Field(() => Date)
	createdAt: Date
}
