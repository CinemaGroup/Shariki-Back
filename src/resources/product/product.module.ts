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
import { CharacteristicModule } from './characteristic/characteristic.module'
import { ProductResolver } from './product.resolver'
import { ProductService } from './product.service'

@Module({
	providers: [
		ProductResolver,
		ProductService,
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
		CharacteristicModule,
	],
})
export class ProductModule {}
