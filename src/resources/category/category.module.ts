import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'src/config/jwt.config'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthModule } from '../auth/auth.module'
import { AuthService } from '../auth/auth.service'
import { JwtStrategy } from '../auth/strategies/jwt.strategy'
import { PaginationService } from '../pagination/pagination.service'
import { UserService } from '../user/user.service'
import { CategoryResolver } from './category.resolver'
import { CategoryService } from './category.service'

@Module({
	providers: [
		CategoryResolver,
		CategoryService,
		PrismaService,
		PaginationService,
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
export class CategoryModule {}
