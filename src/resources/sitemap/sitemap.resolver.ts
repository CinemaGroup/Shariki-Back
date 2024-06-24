import { Query, Resolver } from '@nestjs/graphql'
import { Sitemap } from './entities/sitemap.entity'
import { SitemapService } from './sitemap.service'

@Resolver()
export class SitemapResolver {
	constructor(private readonly sitemapService: SitemapService) {}

	@Query(() => Sitemap, { name: 'sitemap' })
	async getSitemap() {
		return this.sitemapService.getSitemap()
	}
}
