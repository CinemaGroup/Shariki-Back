import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { GqlContext } from 'src/global/types/gql-context.type'
import { AuthService } from './auth.service'
import { Auth } from './decorators/auth.decorator'
import { AuthResponse } from './entities/auth-response.entity'
import { AuthLoginInput } from './inputs/auth-login.input'
import { AuthRegisterInput } from './inputs/auth-register.input'

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Mutation(() => AuthResponse)
	async register(
		@Args('data') input: AuthRegisterInput,
		@Context() { res }: GqlContext
	) {
		const { refreshToken, accessToken, ...response } =
			await this.authService.register(input)

		await this.authService.addRefreshTokenToCookies(res, refreshToken)
		await this.authService.addAccessTokenToCookies(res, accessToken)

		return response
	}

	@Mutation(() => AuthResponse)
	async login(
		@Args('data') input: AuthLoginInput,
		@Context() { res }: GqlContext
	) {
		const { refreshToken, accessToken, ...response } =
			await this.authService.login(input)

		await this.authService.addRefreshTokenToCookies(res, refreshToken)
		await this.authService.addAccessTokenToCookies(res, accessToken)

		return response
	}

	@Auth()
	@Mutation(() => Boolean, { name: 'logout' })
	async logout(@Context() { res }: GqlContext) {
		return this.authService.logout(res)
	}
}
