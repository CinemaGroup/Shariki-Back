import { ObjectType, Field, Int } from '@nestjs/graphql'
import { User } from './user.entity'
import { Billing } from './billing.entity'

@ObjectType()
export class Profile {
	@Field(() => Int)
	id: number

	@Field(() => String)
	login: string

	@Field(() => String)
	email: string

	@Field(() => String)
	password: string

	@Field(() => String)
	avatarPath: string

	@Field(() => Billing)
	billing: Billing

	@Field(() => User)
	user: User

	@Field(() => Int)
	userId: number

	@Field(() => Date)
	updatedAt: Date

	@Field(() => Date)
	createdAt: Date
}
