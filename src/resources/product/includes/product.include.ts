import type { Prisma } from '@prisma/client'

export const productInclude: Prisma.ProductInclude = {
	sizes: true,
	colors: true,
	characteristics: true,
	types: true,
	seo: true,
	categories: {
		include: {
			categories: {
				include: {
					categories: {
						include: {
							categories: {
								include: {
									categories: {
										include: {
											categories: true,
										},
									},
								},
							},
						},
					},
				},
			},
		},
	},
	tags: true,
	holidays: true,
	collections: true,
	orderItems: true,
}
