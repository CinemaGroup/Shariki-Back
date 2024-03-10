import { Prisma } from '@prisma/client'

export const postInclude: Prisma.PostInclude = {
	rubrics: true,
}
