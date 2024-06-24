import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Sitemap {
	@Field(() => [String])
	productsSlugs: string[]

	@Field(() => [String])
	categoriesSlugs: string[]

	@Field(() => [String])
	postsSlugs: string[]
}
