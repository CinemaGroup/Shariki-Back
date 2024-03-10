import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Profile } from './profile.entity'

@ObjectType()
export class Billing {
	@Field(() => Int)
	id: number

	@Field(() => String)
	firstName: string

	@Field(() => String)
	city: string

	@Field(() => String)
	address: string

	@Field(() => String)
	phone: string

	@Field(() => Profile)
	profile: Profile

	@Field(() => Int)
	profileId: number

	@Field(() => Date)
	updatedAt: Date

	@Field(() => Date)
	createdAt: Date
}
