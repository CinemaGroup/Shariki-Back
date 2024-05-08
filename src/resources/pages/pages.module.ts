import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { PagesResolver } from './pages.resolver'
import { PagesService } from './pages.service'

@Module({
	providers: [PagesResolver, PagesService, PrismaService],
})
export class PagesModule {}
