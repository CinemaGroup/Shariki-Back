import { registerEnumType } from '@nestjs/graphql'

export enum BlockType {
	HOME_FIRST = 'HOME_FIRST',
	HOME_SECOND = 'HOME_SECOND',
	HOME_THIRD = 'HOME_THIRD',
}

registerEnumType(BlockType, {
	name: 'BlockType',
})
