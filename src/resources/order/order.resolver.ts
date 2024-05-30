import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from '../auth/decorators/auth.decorator'
import { UserRole } from '../user/enums/user-role.enum'
import { AllOrders, Order } from './entities/order.entity'
import { PlaceOrderInput } from './inputs/place-order.input'
import { UpdateOrderInput } from './inputs/update-order.input'
import { OrderService } from './order.service'
import { QueryInput } from 'src/global/inputs/query.input'

@Resolver()
export class OrderResolver {
	constructor(private readonly orderService: OrderService) {}

	@Query(() => AllOrders, { name: 'orders' })
	async getAll(@Args('query') input: QueryInput) {
		return this.orderService.getAll(input)
	}

	@Mutation(() => Order, { name: 'placeOrder' })
	async placeOrder(@Args('data') input: PlaceOrderInput) {
		return this.orderService.placeOrder(input)
	}

	// Admin Place

	@Auth(UserRole.ADMIN)
	@Query(() => Order, { name: 'orderById' })
	async getById(@Args('id', { type: () => Int }) id: number) {
		return this.orderService.byId(id)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Order, { name: 'updateOrder' })
	async update(
		@Args('id', { type: () => Int }) id: number,
		@Args('data') input: UpdateOrderInput
	) {
		return this.orderService.update(+id, input)
	}

	@Auth(UserRole.ADMIN)
	@Mutation(() => Order, { name: 'deleteOrder' })
	async delete(@Args('id', { type: () => Int }) id: number) {
		return this.orderService.delete(id)
	}
}
