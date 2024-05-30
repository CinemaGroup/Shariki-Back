import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class PlaceOrderItemInput {
	@Field(() => Int)
	quantity: number

	@Field(() => String, { nullable: true })
	color?: string

	@Field(() => String, { nullable: true })
	size?: string

	@Field(() => Int)
	productId: number
}
