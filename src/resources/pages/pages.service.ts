import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AboutInput } from './inputs/about.input'
import { ForBuyersInput } from './inputs/for-buyers.input'
import { ShippingAndPaymentInput } from './inputs/shipping-and-payment.input'

@Injectable()
export class PagesService {
	constructor(private readonly prisma: PrismaService) {}

	async getShippingAndPayment() {
		const shippingAndPayment = await this.prisma.shippingAndPayment.findMany()

		return shippingAndPayment[0]
	}

	async getForBuyers() {
		const forBuyers = await this.prisma.forBuyers.findMany()

		return forBuyers[0]
	}

	async getAbout() {
		const about = await this.prisma.about.findMany()

		return about[0]
	}

	// Admin Place
	async updateShippingAndPayment(input: ShippingAndPaymentInput) {
		const shippingAndPayment = await this.prisma.shippingAndPayment.findFirst()

		return this.prisma.shippingAndPayment.update({
			where: {
				id: shippingAndPayment.id,
			},
			data: {
				shippingName: input.shippingName,
				shippingContent: input.shippingContent,
				paymentName: input.paymentName,
				paymentContent: input.paymentContent,
			},
		})
	}

	async updateForBuyers(input: ForBuyersInput) {
		const forBuyers = await this.prisma.forBuyers.findFirst()

		return this.prisma.forBuyers.update({
			where: {
				id: forBuyers.id,
			},
			data: {
				name: input.name,
				content: input.content,
			},
		})
	}

	async updateAbout(input: AboutInput) {
		const about = await this.prisma.about.findFirst()

		return this.prisma.about.update({
			where: {
				id: about.id,
			},
			data: {
				name: input.name,
				content: input.content,
			},
		})
	}
}
