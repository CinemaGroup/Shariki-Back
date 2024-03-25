import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UserRole } from '../user/enums/user-role.enum'
import { HolidayService } from './holiday.service'
import { QueryInput } from 'src/global/inputs/query.input'
import { Auth } from '../auth/decorators/auth.decorator'
import { Holiday } from './entities/holiday.entity'
import { HolidayInput } from './inputs/holiday.input'

@Resolver()
export class HolidayResolver {
	constructor(private readonly holidayService: HolidayService) {}

	@Query(() => [Holiday], { name: 'holidays' })
	async getAll(@Args('query') input: QueryInput) {
		return this.holidayService.getAll(input)
	}

	// Admin Place

	@Auth(UserRole.ADMIN)
	@Query(() => Holiday, { name: 'holidayById' })
	async getById(@Args('id', { type: () => Int }) id: number) {
		return this.holidayService.byId(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Holiday, { name: 'toggleHoliday' })
	async togglePublished(@Args('id', { type: () => Int }) id: number) {
		return this.holidayService.togglePublished(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Holiday, { name: 'createHoliday' })
	async create() {
		return this.holidayService.create()
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Holiday, { name: 'updateHoliday' })
	async update(
		@Args('id', { type: () => Int }) id: number,
		@Args('data') input: HolidayInput
	) {
		return this.holidayService.update(+id, input)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Holiday, { name: 'deleteHoliday' })
	async delete(@Args('id', { type: () => Int }) id: number) {
		return this.holidayService.delete(id)
	}
}
