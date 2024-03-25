import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { EnumCookies } from 'src/global/enums/global.enum'
import { UserService } from 'src/resources/user/user.service'
import { AuthService } from '../auth.service'

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {
		super()
	}

	async canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context)
		const request = ctx.getContext().req
		const response = ctx.getContext().res

		const cookiesAccessToken = request.cookies[EnumCookies.ACCESS_TOKEN]
		const cookiesRefreshToken = request.cookies[EnumCookies.REFRESH_TOKEN]

		if (!cookiesRefreshToken) {
			await this.logout(response)
		}

		if (cookiesAccessToken) {
			try {
				return await this.returnResponse(
					ctx,
					request,
					response,
					cookiesAccessToken
				)
			} catch (err) {
				const { accessToken } = await this.generateTokens(
					response,
					cookiesRefreshToken
				)

				console.log(`1 error ${err}`)
				return await this.returnResponse(ctx, request, response, accessToken)
			}
		}

		try {
			const { accessToken } = await this.generateTokens(
				response,
				cookiesRefreshToken
			)

			try {
				return await this.returnResponse(ctx, request, response, accessToken)
			} catch (err) {
				console.log(`2 error ${err}`)
				await this.logout(response)
			}
		} catch (err) {
			console.log(`3 error ${err}`)
			await this.logout(response)
		}
	}

	private logout = async (response: any) => {
		await this.authService.removeRefreshTokenFromCookies(response)
		await this.authService.removeAccessTokenFromCookies(response)
		throw new UnauthorizedException('Logout')
	}

	private returnResponse = async (
		ctx: any,
		request: any,
		response: any,
		accessToken: string
	) => {
		const result = await this.jwtService.verifyAsync(accessToken)
		if (result) {
			request.headers.authorization = `Bearer ${accessToken}`
			const user = await this.userService.byId(result.id)
			ctx.getContext().req.user = user
			return true
		}

		await this.logout(response)
	}

	private generateTokens = async (
		response: any,
		cookiesRefreshToken: string
	) => {
		try {
			const { accessToken, refreshToken } = await this.authService.getNewTokens(
				cookiesRefreshToken,
				response
			)
			await this.authService.addRefreshTokenToCookies(response, refreshToken)
			await this.authService.addAccessTokenToCookies(response, accessToken)

			return {
				accessToken,
			}
		} catch (err) {
			console.log(`4 error ${err}`)
			return await this.logout(response)
		}
	}
}
