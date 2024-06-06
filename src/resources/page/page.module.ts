import { Module } from '@nestjs/common'
import { PageResolver } from './page.resolver'
import { PageService } from './page.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'src/config/jwt.config'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthModule } from '../auth/auth.module'
import { AuthService } from '../auth/auth.service'
import { JwtStrategy } from '../auth/strategies/jwt.strategy'
import { UserService } from '../user/user.service'

@Module({
	providers: [
		PageResolver,
		PageService,
		PrismaService,
		AuthService,
		JwtStrategy,
		UserService,
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
export class PageModule {}
