import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class SitemapService {
	constructor(private readonly prisma: PrismaService) {}

	async getSitemap() {
		const [products, categories, posts] = await Promise.all([
			this.prisma.product.findMany({
				select: {
					slug: true,
				},
			}),
			this.prisma.category.findMany({
				select: {
					slug: true,
				},
			}),
			this.prisma.post.findMany({
				select: {
					slug: true,
				},
			}),
		])

		return {
			categoriesSlugs: categories.map((category) => category.slug) || [],
			productsSlugs: products.map((product) => product.slug) || [],
			postsSlugs: posts.map((post) => post.slug) || [],
		}
	}
}
