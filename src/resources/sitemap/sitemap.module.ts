import { Module } from '@nestjs/common';
import { SitemapService } from './sitemap.service';
import { SitemapResolver } from './sitemap.resolver';
import { PrismaService } from 'src/prisma/prisma.service'

@Module({
  providers: [SitemapResolver, SitemapService, PrismaService],
})
export class SitemapModule {}
