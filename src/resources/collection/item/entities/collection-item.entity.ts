import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Status } from 'src/global/enums/query.enum'
import { Product } from 'src/resources/product/entities/product.entity'
import { Collection } from '../../entities/collection.entity'

@ObjectType()
export class CollectionItem {
	@Field(() => Int)
	id: number

	@Field(() => String)
	name: string

	@Field(() => String)
	slug: string

	@Field(() => String)
	imagePath: string

	@Field(() => [Product])
	products: Product[]

	@Field(() => Collection)
	collection: Collection

	@Field(() => Int)
	collectionId: number

	@Field(() => Status)
	status: Status

	@Field(() => Date)
	updatedAt: Date

	@Field(() => Date)
	createdAt: Date
}
