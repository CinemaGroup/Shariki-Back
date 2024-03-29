import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Product } from '../../entities/product.entity'
import { CharacteristicType } from '../enum/characteristic.enum'

@ObjectType()
export class Characteristic {
	@Field(() => Int)
	id: number

	@Field(() => String)
	name: string

	@Field(() => String)
	slug: string

	@Field(() => CharacteristicType)
	type: CharacteristicType

	@Field(() => Product)
	product: Product

	@Field(() => Int)
	productId: number

	@Field(() => Date)
	updatedAt: Date

	@Field(() => Date)
	createdAt: Date
}
