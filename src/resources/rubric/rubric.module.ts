import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthService } from '../auth/auth.service'
import { JwtStrategy } from '../auth/strategies/jwt.strategy'
import { PaginationService } from '../pagination/pagination.service'
import { UserService } from '../user/user.service'
import { RubricResolver } from './rubric.resolver'
import { RubricService } from './rubric.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'src/config/jwt.config'
import { AuthModule } from '../auth/auth.module'

@Module({
	providers: [
		RubricResolver,
		RubricService,
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
export class RubricModule {}
