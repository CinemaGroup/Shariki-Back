import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Product } from 'src/resources/product/entities/product.entity'
import { Order } from '../../entities/order.entity'

@ObjectType()
export class OrderItem {
	@Field(() => Int)
	id: number

	@Field(() => Int)
	quantity: number

	@Field(() => String, { nullable: true })
	color?: string

	@Field(() => String, { nullable: true })
	size?: string

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
