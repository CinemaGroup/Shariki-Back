import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Order } from 'src/resources/order/entities/order.entity'
import { UserRole } from '../enums/user-role.enum'
import { Profile } from './profile.entity'

@ObjectType()
export class User {
	@Field(() => Int)
	id: number

	@Field(() => Profile)
	profile: Profile

	@Field(() => [Order])
	orders: Order[]

	@Field(() => UserRole)
	role: UserRole

	@Field(() => Boolean)
	isVerified: boolean

	@Field(() => Date)
	updatedAt: Date

	@Field(() => Date)
	createdAt: Date
}
