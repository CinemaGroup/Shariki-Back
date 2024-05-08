import { Injectable } from '@nestjs/common'
import { CategoryService } from '../category/category.service'
import { FiltersService } from '../filters/filters.service'
import { ProductService } from '../product/product.service'
import { Catalog } from './entities/catalog.entity'
import { CatalogInput } from './inputs/catalog.input'

@Injectable()
export class CatalogService {
	constructor(
		private readonly categoryService: CategoryService,
		private readonly productService: ProductService,
		private readonly filtersService: FiltersService
	) {}

	async getCatalog({
		categorySlug,
		categoryInput,
		productInput,
	}: CatalogInput) {
		let categories
		if (categorySlug) {
			const fetchedCategories = await this.categoryService.getAll(
				categoryInput,
				{
					parent: {
						slug: categorySlug,
					},
				}
			)
			categories = fetchedCategories || []
		} else {
			const fetchedCategories = await this.categoryService.getAll(categoryInput)
			categories = fetchedCategories || []
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
			categories,
			rootCategory,
			products: (products || []) as any[],
			filters: filters || null,
			productsCount: count || 0,
		} as Catalog
	}
}
