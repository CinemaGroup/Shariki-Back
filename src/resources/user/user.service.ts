import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { userInclude } from './includes/user.include'

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async getAll() {
		return this.prisma.user.findMany()
	}

	async byId(id: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id,
			},
			include: userInclude
		})

		if (!user) throw new NotFoundException('Пользователь не найден')

		return user
	}
}
