import type { Prisma } from '@prisma/client'

export const orderInclude: Prisma.OrderInclude = {
	items: {
		include: {
			product: true,
		},
	},
}
