import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Sort, Status } from 'src/global/enums/query.enum'
import { QueryInput } from 'src/global/inputs/query.input'
import { PrismaService } from 'src/prisma/prisma.service'
import { generateSlug } from 'src/utils/generateSlug'
import { PaginationService } from '../pagination/pagination.service'
import { CollectionInput } from './inputs/collection.input'

@Injectable()
export class CollectionService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService
	) {}

	async getAll(input: QueryInput) {
		const { perPage, skip } = this.paginationService.getPagination(input)

		const filters = this.createFilter(input)

		const collections = await this.prisma.collection.findMany({
			where: filters,
			orderBy: this.getAllSortOption(input.sort),
			skip,
			take: perPage,
		})

		const count = await this.prisma.collection.count({
			where: filters,
		})

		return {
			collections: collections || [],
			count: count || 0,
		}
	}

	private createFilter(input: QueryInput): Prisma.CollectionWhereInput {
		const filters: Prisma.CollectionWhereInput[] = []

		if (input.searchTerm)
			filters.push(this.getSearchTermFilter(input.searchTerm))

		if (input.status) filters.push(this.getStatusFilter(input.status))

		return filters.length ? { AND: filters } : {}
	}

	private getAllSortOption(
		sort: Sort
	): Prisma.CollectionOrderByWithRelationInput[] {
		switch (sort) {
			case Sort.NEWEST:
				return [{ createdAt: 'desc' }]
			case Sort.OLDEST:
				return [{ createdAt: 'asc' }]
		}
	}

	private getStatusFilter(status: Status): Prisma.CollectionWhereInput {
		return {
			status,
		}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.CollectionWhereInput {
		return {
			name: {
				contains: searchTerm,
				mode: 'insensitive',
			},
		}
	}

	// Admin Place
	async byId(id: number) {
		const collection = await this.prisma.collection.findUnique({
			where: {
				id,
			},
		})

		if (!collection) throw new NotFoundException('Коллекция не найдена.')

		return collection
	}

	async togglePublished(id: number) {
		const collection = await this.byId(id)

		return this.prisma.collection.update({
			where: {
				id,
			},
			data: {
				status:
					collection.status === Status.PUBLISHED
						? Status.HIDDEN
						: Status.PUBLISHED,
			},
		})
	}

	async duplicate(id: number) {
		const collection = await this.byId(id)
		const name = await this.generateUniqueSlug(collection.name)

		return this.prisma.collection.create({
			data: {
				name,
				slug: generateSlug(name),
				status: Status.PUBLISHED,
			},
		})
	}

	async create() {
		const isExists = await this.prisma.collection.findUnique({
			where: {
				slug: '',
			},
		})

		if (isExists) throw new BadRequestException('Коллекция уже существует.')

		return this.prisma.collection.create({
			data: {
				name: '',
				slug: '',
			},
			select: {
				id: true,
			},
		})
	}

	async update(id: number, input: CollectionInput) {
		const collection = await this.byId(id)

		const isExists = await this.prisma.collection.findUnique({
			where: {
				slug: generateSlug(input.name),
				NOT: {
					slug: collection.slug,
				},
			},
		})

		if (isExists) throw new BadRequestException('Коллекция уже существует.')

		return this.prisma.collection.update({
			where: {
				id,
			},
			data: {
				name: input.name,
				slug: generateSlug(input.name),
				status: Status.PUBLISHED,
			},
		})
	}

	async delete(id: number) {
		return this.prisma.collection.delete({
			where: {
				id,
			},
		})
	}

	private generateUniqueSlug = async (queriedName: string, number = 1) => {
		const name = `${queriedName}-${number}`
		const isExist = await this.prisma.collection.findUnique({
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
