import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { hash, verify } from 'argon2'
import { Response } from 'express'
import {
	EXPIRE_DAY_REFRESH_TOKEN,
	EXPIRE_MINUTE_ACCESS_TOKEN,
} from 'src/global/constants/tokens.constants'
import { EnumCookies } from 'src/global/enums/global.enum'
import { PrismaService } from 'src/prisma/prisma.service'
import { isProd } from 'src/utils/is-prod.util'
import { userInclude } from '../user/includes/user.include'
import { AuthLoginInput } from './inputs/auth-login.input'
import { AuthRegisterInput } from './inputs/auth-register.input'

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private prisma: PrismaService,
		private configService: ConfigService
	) {}

	async logout(res: Response) {
		try {
			await this.removeRefreshTokenFromCookies(res)
			await this.removeAccessTokenFromCookies(res)

			return true
		} catch (err) {
			return false
		}
	}

	async register(input: AuthRegisterInput) {
		const oldUser = await this.prisma.user.findFirst({
			where: {
				OR: [
					{
						profile: {
							login: input.login,
						},
					},
					{
						profile: {
							email: input.email,
						},
					},
				],
			},
		})

		if (oldUser)
			throw new BadRequestException('Пользователь уже зарегистрирован')

		const newUser = await this.prisma.user.create({
			data: {
				profile: {
					create: {
						login: input.login,
						email: input.email,
						password: await hash(input.password),
					},
				},
			},
			include: userInclude,
		})

		const tokens = await this.issueTokens(newUser.id)

		return {
			user: newUser,
			...tokens,
		}
	}

	async login(input: AuthLoginInput) {
		const user = await this.validateUser(input)

		const tokens = await this.issueTokens(user.id)

		return {
			user,
			...tokens,
		}
	}

	async getNewTokens(refreshToken: string, res: Response) {
		const result = await this.jwtService.verifyAsync(refreshToken)
		if (!result) {
			this.logout(res)
			throw new UnauthorizedException('Logout')
		}

		const user = await this.prisma.user.findUnique({
			where: {
				id: result.id,
			},
			include: userInclude,
		})

		const tokens = await this.issueTokens(user.id)

		return {
			user,
			...tokens,
		}
	}

	async validateUser(input: AuthLoginInput) {
		const user = await this.prisma.user.findFirst({
			where: {
				profile: {
					email: input.email,
				},
			},
			include: userInclude,
		})
		if (!user) throw new UnauthorizedException('Пользователь не найден')

		const isValidPassword = await verify(user.profile.password, input.password)
		if (!isValidPassword) throw new UnauthorizedException('Неверный пароль')

		return user
	}

	async issueTokens(userId: number) {
		const data = { id: userId }

		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: `${EXPIRE_DAY_REFRESH_TOKEN}d`,
		})

		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: `${EXPIRE_MINUTE_ACCESS_TOKEN}m`,
		})

		return { accessToken, refreshToken }
	}

	async addRefreshTokenToCookies(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(EnumCookies.REFRESH_TOKEN, refreshToken, {
			httpOnly: true,
			domain: process.env.DOMAIN,
			expires: expiresIn,
			secure: isProd(this.configService),
			sameSite: 'none',
		})
	}

	async removeRefreshTokenFromCookies(res: Response) {
		res.clearCookie(EnumCookies.REFRESH_TOKEN)
	}

	async addAccessTokenToCookies(res: Response, accessToken: string) {
		const expiresIn = new Date()
		expiresIn.setTime(
			expiresIn.getTime() + EXPIRE_MINUTE_ACCESS_TOKEN * 60 * 1000
		)

		res.cookie(EnumCookies.ACCESS_TOKEN, accessToken, {
			httpOnly: true,
			domain: process.env.DOMAIN,
			expires: expiresIn,
			secure: isProd(this.configService),
			sameSite: 'none',
		})
	}

	async removeAccessTokenFromCookies(res: Response) {
		res.clearCookie(EnumCookies.ACCESS_TOKEN)
	}
}
