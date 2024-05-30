import { registerEnumType } from '@nestjs/graphql'

export enum OrderStatus {
	PENDING = 'PENDING',
	IN_PROCESS = 'IN_PROCESS',
	COMPLETED = 'COMPLETED',
	CANCELED = 'CANCELED',
}

registerEnumType(OrderStatus, {
	name: 'OrderStatus',
})
