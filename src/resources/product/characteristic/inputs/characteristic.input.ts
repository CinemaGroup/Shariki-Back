import { Field, InputType } from '@nestjs/graphql'
import { CharacteristicType } from '../enum/characteristic.enum'

@InputType()
class CharacteristicSelectInput {
	@Field(() => CharacteristicType)
	value: CharacteristicType

	@Field(() => String)
	name: string
}

@InputType()
export class CharacteristicInput {
	@Field(() => String)
	name: string

	@Field(() => CharacteristicSelectInput)
	type: CharacteristicSelectInput
}