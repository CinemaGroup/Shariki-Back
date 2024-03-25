import { Module } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import { PaginationService } from 'src/resources/pagination/pagination.service'
import { UserService } from 'src/resources/user/user.service'
import { CharacteristicResolver } from './characteristic.resolver'
import { CharacteristicService } from './characteristic.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getJwtConfig } from 'src/config/jwt.config'
import { AuthModule } from 'src/resources/auth/auth.module'
import { AuthService } from 'src/resources/auth/auth.service'
import { JwtStrategy } from 'src/resources/auth/strategies/jwt.strategy'

@Module({
	providers: [
		CharacteristicResolver,
		CharacteristicService,
		PrismaService,
		PaginationService,
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
export class CharacteristicModule {}
