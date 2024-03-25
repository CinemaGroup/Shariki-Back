import { Prisma } from '@prisma/client'

export const categoryInclude: Prisma.CategoryInclude = {
	parent: true,
}
