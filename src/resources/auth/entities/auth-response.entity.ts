import { Field, ObjectType } from '@nestjs/graphql'
import { User } from 'src/resources/user/entities/user.entity'

@ObjectType()
export class AuthResponse {
	@Field(() => User)
	user: User
}
