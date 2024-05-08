import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ShippingAndPaymentInput {
	@Field(() => String)
	shippingName: string

	@Field(() => String)
	shippingContent: string

	@Field(() => String)
	paymentName: string

	@Field(() => String)
	paymentContent: string
}
