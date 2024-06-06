import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from '../auth/decorators/auth.decorator'
import { Block } from '../block/entities/block.entity'
import { BlockType } from '../block/enums/block-type.enum'
import { Seo } from '../seo/entities/seo.entity'
import { UserRole } from '../user/enums/user-role.enum'
import { Page } from './entities/page.entity'
import { PageType } from './enums/page-type.enum'
import { PageInput } from './inputs/page.input'
import { PageService } from './page.service'

@Resolver()
export class PageResolver {
	constructor(private readonly pageService: PageService) {}

	@Query(() => Seo, { name: 'pageSeo', nullable: true })
	async getPageSeo(@Args('type', { type: () => PageType }) type: PageType) {
		return this.pageService.getPageSeo(type)
	}

	@Query(() => Block, { name: 'pageBlock', nullable: true })
	async getPageBlock(@Args('type', { type: () => BlockType }) type: BlockType) {
		return this.pageService.getPageBlock(type)
	}

	// Admin Place
	@Auth(UserRole.ADMIN)
	@Query(() => Page, { name: 'page' })
	async getPage(@Args('type', { type: () => PageType }) type: PageType) {
		return this.pageService.getPage(type)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Boolean, { name: 'updatePage' })
	async updatePage(
		@Args('type', { type: () => PageType }) type: PageType,
		@Args('data') input: PageInput
	) {
		return this.pageService.updatePage(type, input)
	}
}
