import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { MailResolver } from './mail.resolver'
import { MailService } from './mail.service'

@Module({
	providers: [MailResolver, MailService],
	imports: [
		MailerModule.forRoot({
			transport: {
				service: process.env.EMAIL_SERVICE,
				host: process.env.EMAIL_HOST,
				port: parseInt(process.env.EMAIL_PORT),
				ignoreTLS: true,
				secure: true,
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASSWORD,
				},
			},
		}),
	],
})
export class MailModule {}
