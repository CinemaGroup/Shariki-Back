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
import { TagInput } from './inputs/tag.input'

@Injectable()
export class TagService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService
	) {}

	async getAll(input: QueryInput) {
		const { perPage, skip } = this.paginationService.getPagination(input)

		const filters = this.createFilter(input)

		return this.prisma.tag.findMany({
			where: filters,
			orderBy: this.getAllSortOption(input.sort),
			skip,
			take: perPage,
		})
	}

	private createFilter(input: QueryInput): Prisma.TagWhereInput {
		const filters: Prisma.TagWhereInput[] = []

		if (input.searchTerm)
			filters.push(this.getSearchTermFilter(input.searchTerm))

		if (input.status) filters.push(this.getStatusFilter(input.status))

		return filters.length ? { AND: filters } : {}
	}

	private getAllSortOption(sort: Sort): Prisma.TagOrderByWithRelationInput[] {
		switch (sort) {
			case Sort.NEWEST:
				return [{ createdAt: 'desc' }]
			case Sort.OLDEST:
				return [{ createdAt: 'asc' }]
		}
	}

	private getStatusFilter(status: Status): Prisma.TagWhereInput {
		return {
			status,
		}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.TagWhereInput {
		return {
			name: {
				contains: searchTerm,
				mode: 'insensitive',
			},
		}
	}

	// Admin Place
	async byId(id: number) {
		const tag = await this.prisma.tag.findUnique({
			where: {
				id,
			},
		})

		if (!tag) throw new NotFoundException('Метка не найдена.')

		return tag
	}

	async togglePublished(id: number) {
		const tag = await this.byId(id)

		return this.prisma.tag.update({
			where: {
				id,
			},
			data: {
				status:
					tag.status === Status.PUBLISHED ? Status.HIDDEN : Status.PUBLISHED,
			},
		})
	}

	async duplicate(id: number) {
		const tag = await this.byId(id)
		const name = await this.generateUniqueSlug(tag.name)

		return this.prisma.tag.create({
			data: {
				name,
				slug: generateSlug(name),
				imagePath: tag.imagePath,
				status: Status.PUBLISHED,
			},
		})
	}

	async create() {
		const isExists = await this.prisma.tag.findUnique({
			where: {
				slug: '',
			},
		})

		if (isExists) throw new BadRequestException('Метка уже существует.')

		return this.prisma.tag.create({
			data: {
				name: '',
				slug: '',
				imagePath: '',
			},
			select: {
				id: true,
			},
		})
	}

	async update(id: number, input: TagInput) {
		const tag = await this.byId(id)

		const isExists = await this.prisma.tag.findUnique({
			where: {
				slug: generateSlug(input.name),
				NOT: {
					slug: tag.slug,
				},
			},
		})

		if (isExists) throw new BadRequestException('Метка уже существует.')

		return this.prisma.tag.update({
			where: {
				id,
			},
			data: {
				name: input.name,
				slug: generateSlug(input.name),
				imagePath: input.imagePath,
				status: Status.PUBLISHED,
			},
		})
	}

	async delete(id: number) {
		return this.prisma.tag.delete({
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
