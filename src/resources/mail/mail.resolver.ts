import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { CallRequestInput } from './inputs/mail.input'
import { MailService } from './mail.service'

@Resolver()
export class MailResolver {
	constructor(private readonly mailService: MailService) {}

	@Mutation(() => Boolean, { name: 'sendCallRequest' })
	async sendCallRequest(@Args('data') input: CallRequestInput) {
		try {
			return this.mailService.sendEmail({
				subject: 'Заказали звонок',
				email: process.env.EMAIL_ADMIN,
				html: `
					<h1>Заказали звонок</h1>
					<p>Имя: <b>${input.name}</b></p>
					<p>Телефон: <b>${input.phone}</b></p>
				`,
			})
		} catch (err) {
			return false
		}
	}
}
