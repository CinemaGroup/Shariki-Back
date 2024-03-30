import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Prisma, Status } from '@prisma/client'
import { Sort } from 'src/global/enums/query.enum'
import { QueryInput } from 'src/global/inputs/query.input'
import { PrismaService } from 'src/prisma/prisma.service'
import { PaginationService } from '../pagination/pagination.service'
import { TypeInput } from './inputs/type.input'
import { generateSlug } from 'src/utils/generateSlug'

@Injectable()
export class TypeService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService
	) {}

	async getAll(input: QueryInput) {
		const { perPage, skip } = this.paginationService.getPagination(input)

		const filters = this.createFilter(input)

		return this.prisma.type.findMany({
			where: filters,
			orderBy: this.getAllSortOption(input.sort),
			skip,
			take: perPage,
		})
	}

	private createFilter(input: QueryInput): Prisma.TypeWhereInput {
		const filters: Prisma.TypeWhereInput[] = []

		if (input.searchTerm)
			filters.push(this.getSearchTermFilter(input.searchTerm))

		if (input.status) filters.push(this.getPublishedFilter(input.status))

		return filters.length ? { AND: filters } : {}
	}

	private getAllSortOption(sort: Sort): Prisma.TypeOrderByWithRelationInput[] {
		switch (sort) {
			case Sort.NEWEST:
				return [{ createdAt: 'desc' }]
			case Sort.OLDEST:
				return [{ createdAt: 'asc' }]
		}
	}

	private getPublishedFilter(status: Status): Prisma.TypeWhereInput {
		return {
			status,
		}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.TypeWhereInput {
		return {
			iconPath: {
				contains: searchTerm,
				mode: 'insensitive',
			},
		}
	}

	// Admin Place
	async byId(id: number) {
		const type = await this.prisma.type.findUnique({
			where: {
				id,
			},
		})

		if (!type) throw new NotFoundException('Модель не найдена.')

		return type
	}

	async togglePublished(id: number) {
		const type = await this.byId(id)

		return this.prisma.type.update({
			where: {
				id,
			},
			data: {
				status:
					type.status === Status.PUBLISHED ? Status.HIDDEN : Status.PUBLISHED,
			},
		})
	}

	async duplicate(id: number) {
		const type = await this.byId(id)
		const name = await this.generateUniqueSlug(type.name)

		return this.prisma.type.create({
			data: {
				name,
				slug: generateSlug(name),
				iconPath: type.iconPath,
				status: Status.PUBLISHED,
			},
		})
	}

	async create() {
		const isExists = await this.prisma.type.findUnique({
			where: {
				slug: '',
			},
		})

		if (isExists) throw new BadRequestException('Модель уже существует.')

		return this.prisma.type.create({
			data: {
				name: '',
				slug: '',
				iconPath: '',
			},
			select: {
				id: true,
			},
		})
	}

	async update(id: number, input: TypeInput) {
		const type = await this.byId(id)

		const isExists = await this.prisma.type.findUnique({
			where: {
				slug: generateSlug(input.name),
				NOT: {
					slug: type.slug,
				},
			},
		})

		if (isExists) throw new BadRequestException('Модель уже существует.')

		return this.prisma.type.update({
			where: {
				id,
			},
			data: {
				name: input.name,
				slug: generateSlug(input.name),
				iconPath: input.iconPath,
				status: Status.PUBLISHED,
			},
		})
	}

	async delete(id: number) {
		return this.prisma.type.delete({
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
