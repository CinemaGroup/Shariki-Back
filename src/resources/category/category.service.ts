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
import { PaginationService } from '../pagination/pagination.service'
import { CategoryInput } from './inputs/category.input'
import { categoryInclude } from './includes/category.include'

@Injectable()
export class CategoryService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService
	) {}

	async getAll(input: QueryInput) {
		const { perPage, skip } = this.paginationService.getPagination(input)

		const filters = this.createFilter(input)

		return this.prisma.category.findMany({
			where: filters,
			orderBy: this.getAllSortOption(input.sort),
			skip,
			take: perPage,
		})
	}

	private createFilter(input: QueryInput): Prisma.CategoryWhereInput {
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
			include: categoryInclude
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
				parent: {
					connect: { id: input.parent.value },
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
}
