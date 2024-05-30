import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Sort } from 'src/global/enums/query.enum'
import { QueryInput } from 'src/global/inputs/query.input'
import { PrismaService } from 'src/prisma/prisma.service'
import { PaginationService } from '../pagination/pagination.service'
import { orderInclude } from './includes/order.include'
import { PlaceOrderInput } from './inputs/place-order.input'
import { UpdateOrderInput } from './inputs/update-order.input'

@Injectable()
export class OrderService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly paginationService: PaginationService
	) {}

	async getAll(input: QueryInput) {
		const { perPage, skip } = this.paginationService.getPagination(input)

		const filters = this.createFilter(input)

		const orders = await this.prisma.order.findMany({
			where: filters,
			orderBy: this.getAllSortOption(input.sort),
			skip,
			take: perPage,
			include: orderInclude,
		})

		const count = await this.prisma.order.count({
			where: filters,
		})

		return {
			orders: orders || [],
			count: count || 0,
		}
	}

	async placeOrder(input: PlaceOrderInput) {
		return this.prisma.order.create({
			data: {
				status: input.orderStatus,
				items: {
					create: input.items.map((orderItem) => ({
						quantity: orderItem.quantity,
						product: {
							connect: { id: orderItem.productId },
						},
						color: orderItem.color,
						size: orderItem.size,
					})),
				},
				total: input.total,
				name: input.name,
				phone: input.phone,
			},
		})
	}

	private createFilter(input: QueryInput): Prisma.OrderWhereInput {
		const filters: Prisma.OrderWhereInput[] = []

		if (input.searchTerm)
			filters.push(this.getSearchTermFilter(input.searchTerm))

		return filters.length ? { AND: filters } : {}
	}

	private getAllSortOption(sort: Sort): Prisma.OrderOrderByWithRelationInput[] {
		switch (sort) {
			case Sort.NEWEST:
				return [{ createdAt: 'desc' }]
			case Sort.OLDEST:
				return [{ createdAt: 'asc' }]
		}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.OrderWhereInput {
		return {
			name: {
				contains: searchTerm,
				mode: 'insensitive',
			},
		}
	}

	// Admin Place
	async byId(id: number) {
		const order = await this.prisma.order.findUnique({
			where: {
				id,
			},
			include: orderInclude,
		})

		if (!order) throw new NotFoundException('Заказ не найден.')

		return order
	}

	async update(id: number, input: UpdateOrderInput) {
		return this.prisma.order.update({
			where: {
				id,
			},
			data: {
				status: input.orderStatus,
			},
		})
	}

	async delete(id: number) {
		return this.prisma.order.delete({
			where: {
				id,
			},
		})
	}
}
