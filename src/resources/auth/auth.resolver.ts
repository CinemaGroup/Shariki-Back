import { UnauthorizedException } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { GqlContext } from 'src/global/types/gql-context.type'
import { AuthService } from './auth.service'
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
		const { refreshToken, ...response } = await this.authService.register(input)

		this.authService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	@Mutation(() => AuthResponse)
	async login(
		@Args('data') input: AuthLoginInput,
		@Context() { res }: GqlContext
	) {
		const { refreshToken, ...response } = await this.authService.login(input)

		this.authService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	@Mutation(() => AuthResponse)
	async newTokens(@Context() { res, req }: GqlContext) {
		const refreshTokenFromCookies = req.cookies.SHARIKI_XLSF || req.headers.refreshtoken

		if (!refreshTokenFromCookies) {
			this.authService.removeRefreshTokenFromResponse(res)
			throw new UnauthorizedException('Refresh token not passed')
		}

		const { refreshToken, ...response } = await this.authService.getNewTokens(
			refreshTokenFromCookies
		)
		this.authService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	@Mutation(() => Boolean)
	async logout(@Context() { req, res }: GqlContext) {
		const refreshTokenFromCookies = req.cookies.SHARIKI_XLSF || req.headers.refreshtoken

		if (!refreshTokenFromCookies) {
			throw new UnauthorizedException('Refresh token not passed')
		}

		this.authService.removeRefreshTokenFromResponse(res)

		return true
	}
}
