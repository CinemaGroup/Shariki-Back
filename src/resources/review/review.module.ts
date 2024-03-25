import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { getJwtConfig } from 'src/config/jwt.config'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthModule } from '../auth/auth.module'
import { AuthService } from '../auth/auth.service'
import { JwtStrategy } from '../auth/strategies/jwt.strategy'
import { PaginationService } from '../pagination/pagination.service'
import { UserService } from '../user/user.service'
import { ReviewResolver } from './review.resolver'
import { ReviewService } from './review.service'

@Module({
	providers: [
		ReviewResolver,
		ReviewService,
		PaginationService,
		PrismaService,
		AuthService,
		JwtStrategy,
		UserService
	],
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig,
		}),
		AuthModule,
	],
})
export class ReviewModule {}
