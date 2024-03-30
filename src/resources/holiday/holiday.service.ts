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
import { HolidayInput } from './inputs/holiday.input'

@Injectable()
export class HolidayService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService
	) {}

	async getAll(input: QueryInput) {
		const { perPage, skip } = this.paginationService.getPagination(input)

		const filters = this.createFilter(input)

		return this.prisma.holiday.findMany({
			where: filters,
			orderBy: this.getAllSortOption(input.sort),
			skip,
			take: perPage,
		})
	}

	private createFilter(input: QueryInput): Prisma.HolidayWhereInput {
		const filters: Prisma.HolidayWhereInput[] = []

		if (input.searchTerm)
			filters.push(this.getSearchTermFilter(input.searchTerm))

		if (input.status) filters.push(this.getStatusFilter(input.status))

		return filters.length ? { AND: filters } : {}
	}

	private getAllSortOption(
		sort: Sort
	): Prisma.HolidayOrderByWithRelationInput[] {
		switch (sort) {
			case Sort.NEWEST:
				return [{ createdAt: 'desc' }]
			case Sort.OLDEST:
				return [{ createdAt: 'asc' }]
		}
	}

	private getStatusFilter(status: Status): Prisma.HolidayWhereInput {
		return {
			status,
		}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.HolidayWhereInput {
		return {
			name: {
				contains: searchTerm,
				mode: 'insensitive',
			},
		}
	}

	// Admin Place
	async byId(id: number) {
		const holiday = await this.prisma.holiday.findUnique({
			where: {
				id,
			},
		})

		if (!holiday) throw new NotFoundException('Метка не найдена.')

		return holiday
	}

	async togglePublished(id: number) {
		const holiday = await this.byId(id)

		return this.prisma.holiday.update({
			where: {
				id,
			},
			data: {
				status:
					holiday.status === Status.PUBLISHED
						? Status.HIDDEN
						: Status.PUBLISHED,
			},
		})
	}

	async duplicate(id: number) {
		const holiday = await this.byId(id)
		const name = await this.generateUniqueSlug(holiday.name)

		return this.prisma.holiday.create({
			data: {
				name,
				slug: generateSlug(name),
				imagePath: holiday.imagePath,
				status: Status.PUBLISHED,
			},
		})
	}

	async create() {
		const isExists = await this.prisma.holiday.findUnique({
			where: {
				slug: '',
			},
		})

		if (isExists) throw new BadRequestException('Праздник уже существует.')

		return this.prisma.holiday.create({
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

	async update(id: number, input: HolidayInput) {
		const holiday = await this.byId(id)

		const isExists = await this.prisma.holiday.findUnique({
			where: {
				slug: generateSlug(input.name),
				NOT: {
					slug: holiday.slug,
				},
			},
		})

		if (isExists) throw new BadRequestException('Праздник уже существует.')

		return this.prisma.holiday.update({
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
		return this.prisma.holiday.delete({
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
