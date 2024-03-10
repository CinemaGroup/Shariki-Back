import { Field, Int, ObjectType } from '@nestjs/graphql'
import { User } from 'src/resources/user/entities/user.entity'
import { OrderStatus } from '../enums/order-status.enum'
import { PaymentMethod } from '../enums/payment-method.enum'
import { OrderItem } from '../item/entities/order-item.entity'

@ObjectType()
export class Order {
	@Field(() => Int)
	id: number

	@Field(() => PaymentMethod)
	method: PaymentMethod

	@Field(() => OrderStatus)
	status: OrderStatus

	@Field(() => Int)
	total: number

	@Field(() => [OrderItem])
	items: OrderItem[]

	@Field(() => User)
	user: User

	@Field(() => Int)
	userId: number

	@Field(() => Date)
	updatedAt: Date

	@Field(() => Date)
	createdAt: Date
}
