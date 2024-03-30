import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Prisma, Status } from '@prisma/client'
import { Sort } from 'src/global/enums/query.enum'
import { QueryInput } from 'src/global/inputs/query.input'
import { PrismaService } from 'src/prisma/prisma.service'
import { PaginationService } from 'src/resources/pagination/pagination.service'
import { generateSlug } from 'src/utils/generateSlug'
import { CharacteristicInput } from './inputs/characteristic.input'

@Injectable()
export class CharacteristicService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService
	) {}

	async getAll(input: QueryInput) {
		const { perPage, skip } = this.paginationService.getPagination(input)

		const filters = this.createFilter(input)

		return this.prisma.characteristic.findMany({
			where: filters,
			orderBy: this.getAllSortOption(input.sort),
			skip,
			take: perPage,
		})
	}

	private createFilter(input: QueryInput): Prisma.CharacteristicWhereInput {
		const filters: Prisma.CharacteristicWhereInput[] = []

		if (input.searchTerm)
			filters.push(this.getSearchTermFilter(input.searchTerm))

		if (input.status) filters.push(this.getPublishedFilter(input.status))

		return filters.length ? { AND: filters } : {}
	}

	private getAllSortOption(
		sort: Sort
	): Prisma.CharacteristicOrderByWithRelationInput[] {
		switch (sort) {
			case Sort.NEWEST:
				return [{ createdAt: 'desc' }]
			case Sort.OLDEST:
				return [{ createdAt: 'asc' }]
		}
	}

	private getPublishedFilter(status: Status): Prisma.CharacteristicWhereInput {
		return {
			status,
		}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.CharacteristicWhereInput {
		return {
			name: {
				contains: searchTerm,
				mode: 'insensitive',
			},
		}
	}

	// Admin Place
	async byId(id: number) {
		const characteristic = await this.prisma.characteristic.findUnique({
			where: {
				id,
			},
		})

		if (!characteristic) throw new NotFoundException('Характеристика не найдена.')

		return characteristic
	}

	async togglePublished(id: number) {
		const characteristic = await this.byId(id)

		return this.prisma.characteristic.update({
			where: {
				id,
			},
			data: {
				status:
					characteristic.status === Status.PUBLISHED
						? Status.HIDDEN
						: Status.PUBLISHED,
			},
		})
	}

	async duplicate(id: number) {
		const characteristic = await this.byId(id)
		const name = await this.generateUniqueSlug(characteristic.name)

		return this.prisma.characteristic.create({
			data: {
				name,
				slug: generateSlug(name),
				type: characteristic.type,
				status: Status.PUBLISHED,
			},
		})
	}

	async create() {
		const isExists = await this.prisma.characteristic.findUnique({
			where: {
				slug: '',
			},
		})

		if (isExists)
			throw new BadRequestException('Характеристика уже существует.')

		return this.prisma.characteristic.create({
			data: {
				name: '',
				slug: '',
			},
			select: {
				id: true,
			},
		})
	}

	async update(id: number, input: CharacteristicInput) {
		const characteristic = await this.byId(id)

		const isExists = await this.prisma.characteristic.findUnique({
			where: {
				slug: generateSlug(input.name),
				NOT: {
					slug: characteristic.slug,
				},
			},
		})

		if (isExists)
			throw new BadRequestException('Характеристика уже существует.')

		return this.prisma.characteristic.update({
			where: {
				id,
			},
			data: {
				name: input.name,
				slug: generateSlug(input.name),
				type: input.type.value,
				status: Status.PUBLISHED,
			},
		})
	}

	async delete(id: number) {
		return this.prisma.characteristic.delete({
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
