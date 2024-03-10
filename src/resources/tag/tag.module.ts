import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { PaginationService } from '../pagination/pagination.service'
import { TagResolver } from './tag.resolver'
import { TagService } from './tag.service'

@Module({
	providers: [TagResolver, TagService, PrismaService, PaginationService],
})
export class TagModule {}
