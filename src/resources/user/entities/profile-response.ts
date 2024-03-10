import { Field, ObjectType } from '@nestjs/graphql'
import { User } from './user.entity'

@ObjectType()
export class ProfileResponse {
	@Field(() => User)
	user: User
}
