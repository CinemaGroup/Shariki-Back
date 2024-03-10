import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { PaginationService } from '../pagination/pagination.service'
import { PostResolver } from './post.resolver'
import { PostService } from './post.service'

@Module({
	providers: [PostResolver, PostService, PrismaService, PaginationService],
})
export class PostModule {}
