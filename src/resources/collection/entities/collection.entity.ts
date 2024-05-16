import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Status } from 'src/global/enums/query.enum'
import { Product } from 'src/resources/product/entities/product.entity'

@ObjectType()
export class Collection {
	@Field(() => Int)
	id: number

	@Field(() => String)
	name: string

	@Field(() => String)
	slug: string

	@Field(() => [Product])
	products: Product[]

	@Field(() => Status)
	status: Status

	@Field(() => Date)
	updatedAt: Date

	@Field(() => Date)
	createdAt: Date
}

@ObjectType()
export class AllCollections {
	@Field(() => [Collection])
	collections: Collection[]

	@Field(() => Int)
	count: number
}
