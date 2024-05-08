import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { About } from './entities/about.entity'
import { ForBuyers } from './entities/for-buyers.entity'
import { ShippingAndPayment } from './entities/shipping-and-payment.entity'
import { AboutInput } from './inputs/about.input'
import { ForBuyersInput } from './inputs/for-buyers.input'
import { ShippingAndPaymentInput } from './inputs/shipping-and-payment.input'
import { PagesService } from './pages.service'

@Resolver()
export class PagesResolver {
	constructor(private readonly pagesService: PagesService) {}

	@Query(() => ShippingAndPayment, { name: 'shippingAndPayment' })
	async getShippingAndPayment() {
		return this.pagesService.getShippingAndPayment()
	}

	@Query(() => ForBuyers, { name: 'forBuyers' })
	async getForBuyers() {
		return this.pagesService.getForBuyers()
	}

	@Query(() => About, { name: 'about' })
	async getAbout() {
		return this.pagesService.getAbout()
	}

	// Admin Place
	@Mutation(() => ShippingAndPayment, { name: 'updateShippingAndPayment' })
	async updateShippingAndPayment(@Args('data') input: ShippingAndPaymentInput) {
		return this.pagesService.updateShippingAndPayment(input)
	}

	@Mutation(() => ForBuyers, { name: 'updateForBuyers' })
	async updateForBuyers(@Args('data') input: ForBuyersInput) {
		return this.pagesService.updateForBuyers(input)
	}

	@Mutation(() => About, { name: 'updateAbout' })
	async updateAbout(@Args('data') input: AboutInput) {
		return this.pagesService.updateAbout(input)
	}
}
