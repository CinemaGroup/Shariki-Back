import { registerEnumType } from '@nestjs/graphql'

export enum Sort {
	NEWEST = 'NEWEST',
	OLDEST = 'OLDEST',
}

registerEnumType(Sort, {
	name: 'Sort',
})

export enum Status {
	PUBLISHED = 'PUBLISHED',
	HIDDEN = 'HIDDEN',
}

registerEnumType(Status, {
	name: 'Status',
})
