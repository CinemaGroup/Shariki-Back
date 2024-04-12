import { Module } from '@nestjs/common'
import { CollectionResolver } from './collection.resolver'
import { CollectionService } from './collection.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'src/config/jwt.config'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthModule } from '../auth/auth.module'
import { AuthService } from '../auth/auth.service'
import { JwtStrategy } from '../auth/strategies/jwt.strategy'
import { PaginationService } from '../pagination/pagination.service'
import { UserModule } from '../user/user.module'
import { UserService } from '../user/user.service'

@Module({
	providers: [
		CollectionResolver,
		CollectionService,
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
		UserModule,
	],
})
export class CollectionModule {}
