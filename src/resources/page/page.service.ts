import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { BlockType } from '../block/enums/block-type.enum'
import { blockSelect } from '../block/select/block.select'
import { seoSelect } from '../seo/select/seo.select'
import { PageType } from './enums/page-type.enum'
import { PageInput } from './inputs/page.input'
import { pageSelect } from './selects/page.select'

@Injectable()
export class PageService {
	constructor(private readonly prisma: PrismaService) {}

	async getPageBlock(type: BlockType) {
		return this.prisma.block.findUnique({
			where: {
				type,
			},
			select: blockSelect,
		})
	}

	async getPageSeo(type: PageType) {
		return this.prisma.seo.findUnique({
			where: {
				type,
			},
			select: seoSelect,
		})
	}

	async getPage(type: PageType) {
		return this.prisma.page.findUnique({
			where: {
				type,
			},
			select: pageSelect,
		})
	}

	async updatePage(type: PageType, input: PageInput) {
		const page = await this.prisma.page.findUnique({
			where: {
				type,
			},
			select: pageSelect,
		})

		await this.prisma.page.update({
			where: {
				type,
			},
			data: {
				blocks: {
					deleteMany: {},
					create: input.blocks.map((block) => ({
						heading: block.heading,
						content: block.content,
						type: block.type,
					})),
				},
				seo: {
					delete: page.seo ? true : false,
					create: {
						title: input.seo.title,
						description: input.seo.description,
						type,
					},
				},
				type,
			},
		})

		return true
	}
}
