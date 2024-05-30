import { Field, InputType } from '@nestjs/graphql'
import { OrderStatus } from '../enums/order-status.enum'

@InputType()
export class UpdateOrderInput {
	@Field(() => OrderStatus)
	readonly orderStatus: OrderStatus
}
