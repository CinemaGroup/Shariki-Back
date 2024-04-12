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
import { productInclude } from './includes/product.include'
import { ProductInput } from './inputs/product.input'
import { QueryProductInput } from './inputs/query-product.input'

@Injectable()
export class ProductService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService
	) {}

	async getAll(input: QueryProductInput, isSale?: boolean) {
		const { perPage, skip } = this.paginationService.getPagination(input)

		const filters = this.createFilter(input)

		if (isSale) {
			filters.oldPrice = { not: null }
		}

		return this.prisma.product.findMany({
			where: filters,
			orderBy: this.getAllSortOption(input.sort),
			skip,
			take: perPage,
			include: productInclude,
		})
	}

	private createFilter(input: QueryProductInput): Prisma.ProductWhereInput {
		const filters: Prisma.ProductWhereInput[] = []

		if (input.searchTerm)
			filters.push(this.getSearchTermFilter(input.searchTerm))

		if (input.status) filters.push(this.getPublishedFilter(input.status))

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
		const isExist = await this.prisma.category.findUnique({
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
