import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FiltersItem {
	@Field(() => String)
	label: string

	@Field(() => String)
	value: string

	@Field(() => Int)
	count: number
}

@ObjectType()
export class RangeFilter {
	@Field(() => Int)
	min: number

	@Field(() => Int)
	max: number
}

@ObjectType()
export class ImageFilter {
	@Field(() => String)
	iconPath: string

	@Field(() => String, { nullable: true })
	uncheckedIconPath?: string

	@Field(() => String)
	value: string
}

@ObjectType()
export class Filters {
	@Field(() => [FiltersItem])
	sizes: FiltersItem[]

	@Field(() => [FiltersItem])
	colors: FiltersItem[]

	@Field(() => [FiltersItem])
	hues: FiltersItem[]

	@Field(() => [FiltersItem])
	manufacturers: FiltersItem[]

	@Field(() => [FiltersItem])
	materials: FiltersItem[]

	@Field(() => [FiltersItem])
	countries: FiltersItem[]

	@Field(() => [ImageFilter])
	types: ImageFilter[]

	@Field(() => [FiltersItem])
	collections: FiltersItem[]

	@Field(() => [FiltersItem])
	holidays: FiltersItem[]

	@Field(() => RangeFilter)
	price: RangeFilter
}
