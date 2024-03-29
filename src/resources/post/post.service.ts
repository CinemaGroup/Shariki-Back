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
import { postInclude } from './includes/post.include'
import { PostInput } from './inputs/post.input'

@Injectable()
export class PostService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService
	) {}

	async getAll(input: QueryInput) {
		const { perPage, skip } = this.paginationService.getPagination(input)

		const filters = this.createFilter(input)

		return this.prisma.post.findMany({
			where: filters,
			orderBy: this.getAllSortOption(input.sort),
			skip,
			take: perPage,
			include: postInclude,
		})
	}

	private createFilter(input: QueryInput): Prisma.PostWhereInput {
		const filters: Prisma.PostWhereInput[] = []

		if (input.searchTerm)
			filters.push(this.getSearchTermFilter(input.searchTerm))

		if (input.status) filters.push(this.getPublishedFilter(input.status))

		return filters.length ? { AND: filters } : {}
	}

	private getAllSortOption(sort: Sort): Prisma.PostOrderByWithRelationInput[] {
		switch (sort) {
			case Sort.NEWEST:
				return [{ createdAt: 'desc' }]
			case Sort.OLDEST:
				return [{ createdAt: 'asc' }]
		}
	}

	private getPublishedFilter(status: Status): Prisma.PostWhereInput {
		return {
			status,
		}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.PostWhereInput {
		return {
			name: {
				contains: searchTerm,
				mode: 'insensitive',
			},
		}
	}

	// Admin Place
	async byId(id: number) {
		const post = await this.prisma.post.findUnique({
			where: {
				id,
			},
			include: postInclude,
		})

		if (!post) throw new NotFoundException('Пост не найден.')

		return post
	}

	async togglePublished(id: number) {
		const post = await this.byId(id)

		return this.prisma.post.update({
			where: {
				id,
			},
			data: {
				status:
					post.status === Status.PUBLISHED ? Status.HIDDEN : Status.PUBLISHED,
			},
		})
	}

	async create() {
		const isExists = await this.prisma.post.findUnique({
			where: {
				slug: '',
			},
		})

		if (isExists) throw new BadRequestException('Пост уже существует.')

		return this.prisma.post.create({
			data: {
				name: '',
				slug: '',
				excerpt: '',
				description: '',
				poster: '',
				bigPoster: '',
			},
			select: {
				id: true,
			},
		})
	}

	async update(id: number, input: PostInput) {
		const post = await this.byId(id)

		const isExists = await this.prisma.tag.findUnique({
			where: {
				slug: generateSlug(input.name),
				NOT: {
					slug: post.slug,
				},
			},
		})

		if (isExists) throw new BadRequestException('Пост уже существует.')

		return this.prisma.post.update({
			where: {
				id,
			},
			data: {
				name: input.name,
				slug: generateSlug(input.name),
				excerpt: input.excerpt,
				description: input.description,
				poster: input.poster,
				bigPoster: input.bigPoster,
				rubrics: {
					connect: input.rubrics.map((rubric) => ({ id: rubric })),
				},
				status: Status.PUBLISHED,
			},
			include: postInclude,
		})
	}

	async delete(id: number) {
		return this.prisma.post.delete({
			where: {
				id,
			},
		})
	}
}
