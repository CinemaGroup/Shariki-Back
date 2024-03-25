import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { QueryInput } from 'src/global/inputs/query.input'
import { Auth } from 'src/resources/auth/decorators/auth.decorator'
import { UserRole } from 'src/resources/user/enums/user-role.enum'
import { CharacteristicService } from './characteristic.service'
import { Characteristic } from './entities/characteristic.entity'
import { CharacteristicInput } from './inputs/characteristic.input'

@Resolver()
export class CharacteristicResolver {
	constructor(private readonly characteristicService: CharacteristicService) {}

	@Query(() => [Characteristic], { name: 'characteristics' })
	async getAll(@Args('query') input: QueryInput) {
		return this.characteristicService.getAll(input)
	}

	// Admin Place
	@Auth(UserRole.ADMIN)
	@Query(() => Characteristic, { name: 'characteristicById' })
	async getById(@Args('id', { type: () => Int }) id: number) {
		return this.characteristicService.byId(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Characteristic, { name: 'toggleCharacteristic' })
	async togglePublished(@Args('id', { type: () => Int }) id: number) {
		return this.characteristicService.togglePublished(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Characteristic, { name: 'createCharacteristic' })
	async create() {
		return this.characteristicService.create()
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Characteristic, { name: 'updateCharacteristic' })
	async update(
		@Args('id', { type: () => Int }) id: number,
		@Args('data') input: CharacteristicInput
	) {
		return this.characteristicService.update(+id, input)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Characteristic, { name: 'deleteCharacteristic' })
	async delete(@Args('id', { type: () => Int }) id: number) {
		return this.characteristicService.delete(id)
	}
}
