import { Field, InputType } from '@nestjs/graphql'
import { OrderStatus } from '../enums/order-status.enum'
import { PlaceOrderItemInput } from './place-order-item.input'

@InputType()
export class PlaceOrderInput {
	@Field(() => OrderStatus)
	readonly orderStatus: OrderStatus

	@Field(() => String)
	readonly name: string

	@Field(() => String)
	readonly phone: string

	@Field(() => String)
	readonly total: string

	@Field(() => [PlaceOrderItemInput])
	readonly items: PlaceOrderItemInput[]
}
