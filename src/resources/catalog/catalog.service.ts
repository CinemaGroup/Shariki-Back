import { Injectable } from '@nestjs/common'
import { CategoryService } from '../category/category.service'
import { FiltersService } from '../filters/filters.service'
import { PageType } from '../page/enums/page-type.enum'
import { PageService } from '../page/page.service'
import { ProductService } from '../product/product.service'
import { Catalog } from './entities/catalog.entity'
import { CatalogInput } from './inputs/catalog.input'

@Injectable()
export class CatalogService {
	constructor(
		private readonly categoryService: CategoryService,
		private readonly productService: ProductService,
		private readonly filtersService: FiltersService,
		private readonly pageService: PageService
	) {}

	async getCatalog({
		categorySlug,
		categoryInput,
		productInput,
	}: CatalogInput) {
		let categories
		let block = null

		if (categorySlug) {
			const { categories: fetchedCategories } =
				await this.categoryService.getAll(categoryInput, {
					parent: {
						slug: categorySlug,
					},
				})
			categories = fetchedCategories
			const category = await this.categoryService.getBlock(categorySlug)
			block = category.block
		} else {
			const { categories: fetchedCategories } =
				await this.categoryService.getAll(categoryInput)
			categories = fetchedCategories
			const catalog = await this.pageService.getPage(PageType.CATALOG)
			block = catalog.blocks[0]
		}

		const { products, count } = await this.productService.getAll(
			productInput,
			undefined,
			categorySlug
		)

		const { products: allProducts, rootCategory } =
			await this.productService.allProducts(productInput, categorySlug)

		const filters = await this.filtersService.getFilters(allProducts as any[])

		return {
			block: block || null,
			categories,
			rootCategory,
			products: (products || []) as any[],
			filters: filters || null,
			productsCount: count || 0,
		} as Catalog
	}
}
