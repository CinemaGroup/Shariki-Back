import { Prisma } from '@prisma/client'

export const productInclude: Prisma.ProductInclude = {
	sizes: true,
	colors: true,
	characteristics: true,
	types: true,
	categories: true,
	tags: true,
	holidays: true,
	orderItems: true,
}
