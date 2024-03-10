import { Prisma } from '@prisma/client'

export const userInclude: Prisma.UserInclude = {
	profile: {
		include: {
			billing: true,
		},
	},
}
