import { Field, Int, ObjectType } from '@nestjs/graphql'
import { OrderStatus } from '../enums/order-status.enum'
import { OrderItem } from '../item/entities/order-item.entity'

@ObjectType()
export class Order {
	@Field(() => Int)
	id: number

	@Field(() => OrderStatus)
	status: OrderStatus

	@Field(() => Int)
	total: number

	@Field(() => String)
	name: string

	@Field(() => String)
	phone: string

	@Field(() => [OrderItem])
	items: OrderItem[]

	@Field(() => Date)
	updatedAt: Date

	@Field(() => Date)
	createdAt: Date
}

@ObjectType()
export class AllOrders {
	@Field(() => [Order])
	orders: Order[]

	@Field(() => Int)
	count: number
}
