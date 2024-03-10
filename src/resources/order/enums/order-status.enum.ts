import { registerEnumType } from '@nestjs/graphql'

export enum OrderStatus {
	PENDING = 'PENDING',
  IN_PROCESS = 'IN_PROCESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  REFUNDED = 'REFUNDED',
}

registerEnumType(OrderStatus, {
	name: 'OrderStatus',
})