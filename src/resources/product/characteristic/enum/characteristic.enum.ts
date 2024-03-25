import { registerEnumType } from '@nestjs/graphql'

export enum CharacteristicType {
	HUE = 'HUE',
	MANUFACTURER = 'MANUFACTURER',
	MATERIAL = 'MATERIAL',
	COUNTRY = 'COUNTRY',
	COLLECTION = 'COLLECTION',
}

registerEnumType(CharacteristicType, {
	name: 'CharacteristicType',
})
