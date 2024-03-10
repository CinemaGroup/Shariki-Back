import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Status } from 'src/global/enums/query.enum'
import { CollectionItem } from '../item/entities/collection-item.entity'

@ObjectType()
export class Collection {
	@Field(() => Int)
	id: number

	@Field(() => String)
	name: string

	@Field(() => [CollectionItem])
	items: CollectionItem[]

	@Field(() => Status)
	status: Status

	@Field(() => Date)
	updatedAt: Date

	@Field(() => Date)
	createdAt: Date
}
