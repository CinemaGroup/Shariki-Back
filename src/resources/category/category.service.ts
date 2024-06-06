import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Prisma, Status } from '@prisma/client'
import { Sort } from 'src/global/enums/query.enum'
import { QueryInput } from 'src/global/inputs/query.input'
import { PrismaService } from 'src/prisma/prisma.service'
import { generateSlug } from 'src/utils/generateSlug'
import { blockSelect } from '../block/select/block.select'
import { PaginationService } from '../pagination/pagination.service'
import { seoSelect } from '../seo/select/seo.select'
import { categoryInclude } from './includes/category.include'
import { CategoryInput } from './inputs/category.input'
import { QueryCategoryInput } from './inputs/query-category.input'

@Injectable()
export class CategoryService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService
	) {}

	async getAll(input: QueryCategoryInput, query?: object) {
		const { perPage, skip } = this.paginationService.getPagination(input)

		let filters = this.createFilter(input)

		if (input.isParents) {
			if ('AND' in filters) {
				filters.AND.push({
					parentId: null,
				})
			} else {
				filters = {
					AND: [
						{
							parentId: null,
						},
					],
					...filters,
				}
			}
		}

		if (query) {
			filters = {
				AND: [filters, query],
			}
		}

		const categories = await this.prisma.category.findMany({
			where: filters,
			orderBy: this.getAllSortOption(input.sort),
			skip,
			take: perPage,
			include: categoryInclude,
		})

		const count = await this.prisma.category.count({
			where: filters,
		})

		return {
			categories: categories || [],
			count: count || 0,
		}
	}

	async getBlock(slug: string) {
		return this.prisma.category.findUnique({
			where: {
				slug,
			},
			select: {
				block: {
					select: blockSelect,
				},
			},
		})
	}

	async getSeo(slug: string) {
		const category = await this.prisma.category.findUnique({
			where: {
				slug,
			},
			select: {
				seo: {
					select: seoSelect,
				},
			},
		})

		return category.seo
	}

	private createFilter(input: QueryInput) {
		const filters: Prisma.CategoryWhereInput[] = []

		if (input.searchTerm)
			filters.push(this.getSearchTermFilter(input.searchTerm))

		if (input.status) filters.push(this.getPublishedFilter(input.status))

		return filters.length ? { AND: filters } : {}
	}

	private getAllSortOption(
		sort: Sort
	): Prisma.CategoryOrderByWithRelationInput[] {
		switch (sort) {
			case Sort.NEWEST:
				return [{ createdAt: 'desc' }]
			case Sort.OLDEST:
				return [{ createdAt: 'asc' }]
		}
	}

	private getPublishedFilter(status: Status): Prisma.CategoryWhereInput {
		return {
			status,
		}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.CategoryWhereInput {
		return {
			name: {
				contains: searchTerm,
				mode: 'insensitive',
			},
		}
	}

	// Admin Place
	async byId(id: number) {
		const category = await this.prisma.category.findUnique({
			where: {
				id,
			},
			include: categoryInclude,
		})

		if (!category) throw new NotFoundException('Категория не найдена.')

		return category
	}

	async togglePublished(id: number) {
		const category = await this.byId(id)

		return this.prisma.category.update({
			where: {
				id,
			},
			data: {
				status:
					category.status === Status.PUBLISHED
						? Status.HIDDEN
						: Status.PUBLISHED,
			},
		})
	}

	async duplicate(id: number) {
		const category = await this.byId(id)
		const name = await this.generateUniqueSlug(category.name)

		return this.prisma.category.create({
			data: {
				name: name,
				slug: generateSlug(name),
				imagePath: category.imagePath,
				parent: category.parentId
					? {
							connect: { id: category.parentId },
					  }
					: undefined,
				seo: category.seo
					? {
							create: {
								title: category.seo.title,
								description: category.seo.description,
							},
					  }
					: undefined,
				block: category.block
					? {
							create: {
								heading: category.block.heading,
								content: category.block.content,
							},
					  }
					: undefined,
				status: Status.PUBLISHED,
			},
		})
	}

	async create() {
		const isExists = await this.prisma.category.findUnique({
			where: {
				slug: '',
			},
		})

		if (isExists) throw new BadRequestException('Категория уже существует.')

		return this.prisma.category.create({
			data: {
				name: '',
				slug: '',
			},
			select: {
				id: true,
			},
		})
	}

	async update(id: number, input: CategoryInput) {
		const category = await this.byId(id)

		const isExists = await this.prisma.category.findUnique({
			where: {
				slug: generateSlug(input.name),
				NOT: {
					slug: category.slug,
				},
			},
		})

		if (isExists) throw new BadRequestException('Категория уже существует.')

		return this.prisma.category.update({
			where: {
				id,
			},
			data: {
				name: input.name,
				slug: generateSlug(input.name),
				imagePath: input.imagePath,
				parent: input.parent
					? {
							connect: { id: input.parent.value },
					  }
					: undefined,
				seo: {
					delete: category.seo ? true : false,
					create: input.seo
						? {
								title: input.seo.title,
								description: input.seo.description,
						  }
						: undefined,
				},
				block: {
					delete: category.block ? true : false,
					create: input.seo
						? {
								heading: input.block.heading,
								content: input.block.content,
						  }
						: undefined,
				},
				status: Status.PUBLISHED,
			},
		})
	}

	async delete(id: number) {
		return this.prisma.category.delete({
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
