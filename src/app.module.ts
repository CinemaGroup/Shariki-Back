import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { getGraphQLConfig } from './config/graphql.config'
import { AuthModule } from './resources/auth/auth.module'
import { PaginationModule } from './resources/pagination/pagination.module'
import { UserModule } from './resources/user/user.module';
import { TagModule } from './resources/tag/tag.module';
import { ProductModule } from './resources/product/product.module';
import { OrderModule } from './resources/order/order.module';
import { ReviewModule } from './resources/review/review.module';
import { PostModule } from './resources/post/post.module';
import { RubricModule } from './resources/rubric/rubric.module';
import { TypeModule } from './resources/type/type.module';
import { CategoryModule } from './resources/category/category.module';
import { CollectionModule } from './resources/collection/collection.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		GraphQLModule.forRootAsync<ApolloDriverConfig>({
			driver: ApolloDriver,
			imports: [ConfigModule],
			useFactory: getGraphQLConfig,
			inject: [ConfigService],
		}),
		AuthModule,
		PaginationModule,
		UserModule,
		TagModule,
		ProductModule,
		OrderModule,
		ReviewModule,
		PostModule,
		RubricModule,
		TypeModule,
		CategoryModule,
		CollectionModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
