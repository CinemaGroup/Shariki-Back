import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Sort, Status } from 'src/global/enums/query.enum'
import { PrismaService } from 'src/prisma/prisma.service'
import { generateSlug } from 'src/utils/generateSlug'
import { PaginationService } from '../pagination/pagination.service'
import { CharacteristicType } from './characteristic/enum/characteristic.enum'
import { productInclude } from './includes/product.include'
import { ProductInput } from './inputs/product.input'
import { QueryProductInput } from './inputs/query-product.input'

@Injectable()
export class ProductService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService
	) {}

	async getAll(
		input: QueryProductInput,
		isPopular?: boolean,
		categorySlug?: string
	) {
		const { perPage, skip } = this.paginationService.getPagination(input)

		let filters = this.createFilter(input)

		if (categorySlug) {
			const category = await this.prisma.category.findUnique({
				where: {
					slug: categorySlug,
				},
				include: {
					categories: {
						include: {
							categories: {
								include: {
									categories: {
										include: {
											categories: {
												include: {
													categories: true,
												},
											},
										},
									},
								},
							},
						},
					},
				},
			})
			const slugs = this.getAllCategorySlugs(category)
			filters = {
				AND: [
					filters,
					{
						categories: {
							some: {
								slug: {
									in: slugs.map((slug) => slug),
								},
							},
						},
					},
				],
			}
		}

		let allProducts = await this.prisma.product.findMany({
			where: filters,
			orderBy: this.getAllSortOption(input.sort),
			include: productInclude,
		})

		let filteredProducts = allProducts.filter((product) => {
			const price = parseFloat(product.price)

			if (input.min && input.max) {
				return price >= parseFloat(input.min) && price <= parseFloat(input.max)
			} else if (input.min) {
				return price >= parseFloat(input.min)
			} else if (input.max) {
				return price <= parseFloat(input.max)
			}

			return true
		})

		const count = filteredProducts.length

		if (isPopular) {
			filteredProducts = this.shuffleArray(filteredProducts)
		}

		if (input.perPage && input.page) {
			filteredProducts = filteredProducts.slice(skip, skip + perPage)
		}

		return {
			products: filteredProducts,
			count,
		}
	}

	private shuffleArray(array: any[]) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[array[i], array[j]] = [array[j], array[i]]
		}
		return array
	}

	private getAllCategorySlugs(category): string[] {
		let slugs = [category.slug]

		if (category.categories && category.categories.length > 0) {
			for (const subCategory of category.categories) {
				const subCategorySlugs = this.getAllCategorySlugs(subCategory)
				slugs = slugs.concat(subCategorySlugs)
			}
		}

		return slugs
	}

	async allProducts(input: QueryProductInput, categorySlug?: string) {
		let filters = this.createFilter(input)

		let rootCategory = null

		if (categorySlug) {
			rootCategory = await this.prisma.category.findUnique({
				where: {
					slug: categorySlug,
				},
				include: {
					categories: {
						include: {
							categories: {
								include: {
									categories: {
										include: {
											categories: {
												include: {
													categories: true,
												},
											},
										},
									},
								},
							},
						},
					},
					parent: {
						include: {
							parent: {
								include: {
									parent: {
										include: {
											parent: {
												include: {
													parent: true,
												},
											},
										},
									},
								},
							},
						},
					},
				},
			})
			const slugs = this.getAllCategorySlugs(rootCategory)
			filters = {
				AND: [
					filters,
					{
						categories: {
							some: {
								slug: {
									in: slugs.map((slug) => slug),
								},
							},
						},
					},
				],
			}
		}

		let products = await this.prisma.product.findMany({
			where: filters,
			orderBy: this.getAllSortOption(input.sort),
			include: productInclude,
		})

		if (input.min || input.max) {
			products = products.filter((product) => {
				const price = parseFloat(product.price)

				if (input.min && input.max) {
					return (
						price >= parseFloat(input.min) && price <= parseFloat(input.max)
					)
				} else if (input.min) {
					return price >= parseFloat(input.min)
				} else if (input.max) {
					return price <= parseFloat(input.max)
				}

				return true
			})
		}

		return {
			products,
			rootCategory,
		}
	}

	private createFilter(input: QueryProductInput): Prisma.ProductWhereInput {
		const filters: Prisma.ProductWhereInput[] = []

		if (input.searchTerm)
			filters.push(this.getSearchTermFilter(input.searchTerm))

		if (input.status) filters.push(this.getPublishedFilter(input.status))

		if (input.sizes && input.sizes.length > 0)
			filters.push(this.getSizesFilter(input.sizes))
		if (input.colors && input.colors.length > 0)
			filters.push(this.getColorsFilter(input.colors))
		if (input.hues && input.hues.length > 0)
			filters.push(this.getHuesFilter(input.hues))
		if (input.types && input.types.length > 0)
			filters.push(this.getTypesFilter(input.types))
		if (input.manufacturers && input.manufacturers.length > 0)
			filters.push(this.getManufacturersFilter(input.manufacturers))
		if (input.materials && input.materials.length > 0)
			filters.push(this.getMaterialsFilter(input.materials))
		if (input.collections && input.collections.length > 0)
			filters.push(this.getCollectionsFilter(input.collections))
		if (input.holidays && input.holidays.length > 0)
			filters.push(this.getHolidaysFilter(input.holidays))
		if (input.countries && input.countries.length > 0)
			filters.push(this.getCountriesFilter(input.countries))
		if (input.tags && input.tags.length > 0)
			filters.push(this.getTagsFilter(input.tags))

		return filters.length ? { AND: filters } : {}
	}

	private getAllSortOption(
		sort: Sort
	): Prisma.ProductOrderByWithRelationInput[] {
		switch (sort) {
			case Sort.NEWEST:
				return [{ createdAt: 'desc' }]
			case Sort.OLDEST:
				return [{ createdAt: 'asc' }]
		}
	}

	private getPublishedFilter(status: Status): Prisma.ProductWhereInput {
		return {
			status,
		}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.ProductWhereInput {
		return {
			name: {
				contains: searchTerm,
				mode: 'insensitive',
			},
		}
	}

	private getSizesFilter(sizes: string[]): Prisma.ProductWhereInput {
		return {
			sizes: {
				some: {
					size: {
						in: sizes.map((size) => size),
					},
				},
			},
		}
	}

	private getColorsFilter(colors: string[]): Prisma.ProductWhereInput {
		return {
			characteristics: {
				some: {
					slug: {
						in: colors.map((color) => color),
					},
					type: CharacteristicType.COLOR,
				},
			},
		}
	}

	private getHuesFilter(hues: string[]): Prisma.ProductWhereInput {
		return {
			characteristics: {
				some: {
					slug: {
						in: hues.map((hue) => hue),
					},
					type: CharacteristicType.HUE,
				},
			},
		}
	}

	private getManufacturersFilter(
		manufacturers: string[]
	): Prisma.ProductWhereInput {
		return {
			characteristics: {
				some: {
					slug: {
						in: manufacturers.map((manufacturer) => manufacturer),
					},
					type: CharacteristicType.MANUFACTURER,
				},
			},
		}
	}

	private getMaterialsFilter(materials: string[]): Prisma.ProductWhereInput {
		return {
			characteristics: {
				some: {
					slug: {
						in: materials.map((material) => material),
					},
					type: CharacteristicType.MATERIAL,
				},
			},
		}
	}

	private getCountriesFilter(countries: string[]): Prisma.ProductWhereInput {
		return {
			characteristics: {
				some: {
					slug: {
						in: countries.map((country) => country),
					},
					type: CharacteristicType.COUNTRY,
				},
			},
		}
	}

	private getTypesFilter(types: string[]): Prisma.ProductWhereInput {
		return {
			types: {
				some: {
					slug: {
						in: types.map((type) => type),
					},
				},
			},
		}
	}

	private getCollectionsFilter(
		collections: string[]
	): Prisma.ProductWhereInput {
		return {
			collections: {
				some: {
					slug: {
						in: collections.map((collection) => collection),
					},
				},
			},
		}
	}

	private getHolidaysFilter(holidays: string[]): Prisma.ProductWhereInput {
		return {
			holidays: {
				some: {
					slug: {
						in: holidays.map((holiday) => holiday),
					},
				},
			},
		}
	}

	private getTagsFilter(tags: string[]): Prisma.ProductWhereInput {
		return {
			tags: {
				some: {
					slug: {
						in: tags.map((tag) => tag),
					},
				},
			},
		}
	}

	async bySlug(slug: string) {
		const product = await this.prisma.product.findUnique({
			where: {
				slug,
			},
			include: productInclude,
		})

		const similarProducts = await this.prisma.product.findMany({
			where: {
				AND: [
					{
						id: {
							not: product.id,
						},
					},
					{
						categories: {
							some: {
								slug: {
									in: product.categories.map((category) => category.slug),
								},
							},
						},
					},
				],
			},
			include: productInclude,
		})

		return {
			product: product || null,
			similarProducts: similarProducts || [],
		}
	}

	// Admin Place
	async byId(id: number) {
		const product = await this.prisma.product.findUnique({
			where: {
				id,
			},
			include: productInclude,
		})

		if (!product) throw new NotFoundException('Продукт не найден.')

		return product
	}

	async togglePublished(id: number) {
		const product = await this.byId(id)

		return this.prisma.product.update({
			where: {
				id,
			},
			data: {
				status:
					product.status === Status.PUBLISHED
						? Status.HIDDEN
						: Status.PUBLISHED,
			},
		})
	}

	async duplicate(id: number) {
		const product = await this.byId(id)
		const name = await this.generateUniqueSlug(product.name)

		return this.prisma.product.create({
			data: {
				name,
				slug: generateSlug(name),
				sku: product.sku,
				iconPath: product.iconPath,
				description: product.description,
				packageQuantity: +product.packageQuantity,
				price: product.price,
				oldPrice: product.oldPrice,
				sizes: {
					create: product.sizes.map((item) => ({
						size: item.size,
						price: item.price,
						oldPrice: item.oldPrice,
					})),
				},
				colors: {
					create: product.colors.map((item) => ({
						color: item.color,
						images: item.images,
					})),
				},
				characteristics: {
					connect: product.characteristics.map((item) => ({ id: item.id })),
				},
				types: {
					connect: product.types.map((item) => ({ id: item.id })),
				},
				categories: {
					connect: product.categories.map((item) => ({ id: item.id })),
				},
				tags: {
					connect: product.tags.map((item) => ({ id: item.id })),
				},
				holidays: {
					connect: product.holidays.map((item) => ({ id: item.id })),
				},
				status: Status.PUBLISHED,
			},
		})
	}

	async create() {
		const isExists = await this.prisma.product.findUnique({
			where: {
				slug: '',
			},
		})

		if (isExists) throw new BadRequestException('Продукт уже существует.')

		return this.prisma.product.create({
			data: {
				name: '',
				slug: '',
				sku: '',
				description: '',
			},
			select: {
				id: true,
			},
		})
	}

	async update(id: number, input: ProductInput) {
		const product = await this.byId(id)

		const isExists = await this.prisma.product.findUnique({
			where: {
				slug: generateSlug(input.name),
				NOT: {
					slug: product.slug,
				},
			},
		})

		if (isExists) throw new BadRequestException('Продукт уже существует.')

		return this.prisma.product.update({
			where: {
				id,
			},
			data: {
				name: input.name,
				slug: generateSlug(input.name),
				sku: input.sku,
				iconPath: input.iconPath,
				description: input.description,
				packageQuantity: +input.packageQuantity,
				price: input.price,
				oldPrice: input.oldPrice,
				images: input.images,
				sizes: {
					deleteMany: {},
					create: input.sizes.map((item) => ({
						size: item.size,
						price: item.price,
						oldPrice: item.oldPrice,
					})),
				},
				colors: {
					deleteMany: {},
					create: input.colors.map((item) => ({
						color: item.color,
						images: item.images,
					})),
				},
				characteristics: {
					disconnect: product.characteristics.map((item) => ({ id: item.id })),
					connect: input.characteristics.map((item) => ({ id: item.value })),
				},
				types: {
					disconnect: product.types.map((item) => ({ id: item.id })),
					connect: input.types.map((item) => ({ id: item.value })),
				},
				categories: {
					disconnect: product.categories.map((item) => ({ id: item.id })),
					connect: input.categories.map((item) => ({ id: item.value })),
				},
				tags: {
					disconnect: product.tags.map((item) => ({ id: item.id })),
					connect: input.tags.map((item) => ({ id: item.value })),
				},
				holidays: {
					disconnect: product.holidays.map((item) => ({ id: item.id })),
					connect: input.holidays.map((item) => ({ id: item.value })),
				},
				collections: {
					disconnect: product.collections.map((item) => ({ id: item.id })),
					connect: input.collections.map((item) => ({ id: item.value })),
				},
				status: Status.PUBLISHED,
			},
		})
	}

	async delete(id: number) {
		return this.prisma.product.delete({
			where: {
				id,
			},
		})
	}

	private generateUniqueSlug = async (queriedName: string, number = 1) => {
		const name = `${queriedName}-${number}`
		const isExist = await this.prisma.product.findUnique({
			where: {
				slug: generateSlug(name),
			},
		})

		if (!isExist) {
			return name
		} else {
			return this.generateUniqueSlug(queriedName, number + 1)
		}
	}
}
