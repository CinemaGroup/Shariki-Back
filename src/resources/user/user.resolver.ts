import { Query, Resolver } from '@nestjs/graphql'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from './decorators/user.decorator'
import { ProfileResponse } from './entities/profile-response'
import { User } from './entities/user.entity'
import { UserService } from './user.service'

@Resolver(() => User)
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Query(() => [User], { name: 'users' })
	async getAll() {
		return this.userService.getAll()
	}

	@Query(() => ProfileResponse, { name: 'profile' })
	@Auth()
	async getProfile(@CurrentUser('id') id: number) {
		return this.userService.byId(id)
	}
}
