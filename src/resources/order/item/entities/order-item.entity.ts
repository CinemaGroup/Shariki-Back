import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { Product } from 'src/resources/product/entities/product.entity'
import { Order } from '../../entities/order.entity'

@ObjectType()
export class OrderItem {
	@Field(() => Int)
	id: number

	@Field(() => Int)
	quantity: number

	@Field(() => Float)
	price: Float32Array

	@Field(() => Float, { nullable: true })
	oldPrice?: Float32Array

	@Field(() => Product)
	product: Product

	@Field(() => Int)
	productId: number

	@Field(() => Order)
	order: Order

	@Field(() => Int)
	orderId: number

	@Field(() => Date)
	updatedAt: Date

	@Field(() => Date)
	createdAt: Date
}
