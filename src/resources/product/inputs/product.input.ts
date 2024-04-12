import { Field, InputType, Int } from '@nestjs/graphql'
import { SelectInput } from 'src/global/inputs/select.input'
import { ColorInput } from '../color/inputs/color.input'
import { SizeInput } from '../size/inputs/size.input'

@InputType()
export class ProductInput {
	@Field(() => String)
	name: string

	@Field(() => String)
	sku: string

	@Field(() => String, { nullable: true })
	iconPath?: string

	@Field(() => String)
	description: string

	@Field(() => String)
	packageQuantity: string

	@Field(() => String)
	price: string

	@Field(() => String, { nullable: true })
	oldPrice?: string

	@Field(() => [SizeInput])
	sizes: SizeInput[]

	@Field(() => [ColorInput])
	colors: ColorInput[]

	@Field(() => [SelectInput])
	characteristics: SelectInput[]

	@Field(() => [SelectInput])
	types: SelectInput[]

	@Field(() => [SelectInput])
	categories: SelectInput[]

	@Field(() => [SelectInput])
	tags: SelectInput[]

	@Field(() => [SelectInput])
	holidays: SelectInput[]

	@Field(() => [SelectInput])
	collections: SelectInput[]
}
