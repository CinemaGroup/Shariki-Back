import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ShippingAndPayment {
	@Field(() => String)
	shippingName: string

	@Field(() => String)
	shippingContent: string

	@Field(() => String)
	paymentName: string

	@Field(() => String)
	paymentContent: string
}
