import { registerEnumType } from '@nestjs/graphql'

export enum PageType {
	HOME = 'HOME',
	CATALOG = 'CATALOG',
	POSTS = 'POSTS'
}

registerEnumType(PageType, {
	name: 'PageType',
})
