import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { PaginationService } from '../pagination/pagination.service'
import { ProductResolver } from './product.resolver'
import { ProductService } from './product.service'

@Module({
	providers: [
		ProductResolver,
		ProductService,
		PrismaService,
		PaginationService,
	],
})
export class ProductModule {}
