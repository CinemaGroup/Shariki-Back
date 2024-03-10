import { registerEnumType } from '@nestjs/graphql'

export enum PaymentMethod {
	YOOKASSA = 'YOOKASSA',
}

registerEnumType(PaymentMethod, {
	name: 'PaymentMethod',
})