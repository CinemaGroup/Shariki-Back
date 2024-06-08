import { Module } from '@nestjs/common'
import { OrderResolver } from './order.resolver'
import { OrderService } from './order.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'src/config/jwt.config'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthModule } from '../auth/auth.module'
import { AuthService } from '../auth/auth.service'
import { JwtStrategy } from '../auth/strategies/jwt.strategy'
import { PaginationService } from '../pagination/pagination.service'
import { UserService } from '../user/user.service'
import { MailService } from '../mail/mail.service'

@Module({
	providers: [
		OrderResolver,
		OrderService,
		PrismaService,
		PaginationService,
		AuthService,
		JwtStrategy,
		UserService,
		MailService
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
export class OrderModule {}
