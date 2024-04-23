import { Prisma } from '@prisma/client'

export const categoryInclude: Prisma.CategoryInclude = {
	parent: {
		include: {
			parent: {
				include: {
					parent: {
						include: {
							parent: {
								include: {
									parent: true,
								},
							},
						},
					},
				},
			},
		},
	},
}
