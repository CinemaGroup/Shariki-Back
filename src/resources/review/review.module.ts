import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { PaginationService } from '../pagination/pagination.service'
import { ReviewResolver } from './review.resolver'
import { ReviewService } from './review.service'

@Module({
	providers: [ReviewResolver, ReviewService, PaginationService, PrismaService],
})
export class ReviewModule {}
