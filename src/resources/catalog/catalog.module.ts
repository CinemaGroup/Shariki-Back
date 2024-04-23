import { Module } from '@nestjs/common'
import { CategoryService } from '../category/category.service'
import { FiltersService } from '../filters/filters.service'
import { ProductService } from '../product/product.service'
import { CatalogResolver } from './catalog.resolver'
import { CatalogService } from './catalog.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { PaginationService } from '../pagination/pagination.service'

@Module({
	providers: [
		CatalogResolver,
		CatalogService,
		CategoryService,
		ProductService,
		FiltersService,
		PrismaService,
		PaginationService
	],
})
export class CatalogModule {}
