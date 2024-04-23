import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Status } from 'src/global/enums/query.enum'
import { Category } from 'src/resources/category/entities/category.entity'
import { Collection } from 'src/resources/collection/entities/collection.entity'
import { Holiday } from 'src/resources/holiday/entities/holiday.entity'
import { OrderItem } from 'src/resources/order/item/entities/order-item.entity'
import { Tag } from 'src/resources/tag/entities/tag.entity'
import { Type } from 'src/resources/type/entities/type.entity'
import { Characteristic } from '../characteristic/entities/characteristic.entity'
import { Color } from '../color/entities/color.entity'
import { Size } from '../size/entities/size.entity'

@ObjectType()
export class Product {
	@Field(() => Int)
	id: number

	@Field(() => String)
	name: string

	@Field(() => String)
	slug: string

	@Field(() => String)
	sku: string

	@Field(() => String, { nullable: true })
	iconPath?: string

	@Field(() => String)
	description: string

	@Field(() => [String])
	images: string[]

	@Field(() => Int)
	packageQuantity: number

	@Field(() => String)
	price: string

	@Field(() => String, { nullable: true })
	oldPrice?: string

	@Field(() => [Size])
	sizes: Size[]

	@Field(() => [Color])
	colors: Color[]

	@Field(() => [Characteristic])
	characteristics: Characteristic[]

	@Field(() => Int)
	views: number

	@Field(() => Int)
	boughtTimes: number

	@Field(() => [Type])
	types: Type[]

	@Field(() => [Category])
	categories: Category[]

	@Field(() => [Tag])
	tags: Tag[]

	@Field(() => [Holiday])
	holidays: Holiday[]

	@Field(() => [Collection])
	collections: Collection[]

	@Field(() => [OrderItem])
	orderItems: OrderItem[]

	@Field(() => Status)
	status: Status

	@Field(() => Int)
	typeId: number

	@Field(() => Date)
	updatedAt: Date

	@Field(() => Date)
	createdAt: Date
}

@ObjectType()
export class CurrentProduct {
	@Field(() => Product, { nullable: true })
	product: Product

	@Field(() => [Product])
	similarProducts: Product[]
}

@ObjectType()
export class CatalogProduct {
	@Field(() => [Product])
	products: Product[]

	@Field(() => Int)
	count: number
}
