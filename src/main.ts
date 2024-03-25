import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser'
import { graphqlUploadExpress } from 'graphql-upload-ts'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)

	app.use(
		graphqlUploadExpress({
			maxFileSize: 10 * 1024 * 1024 * 1024,
			maxFiles: 100,
			overrideSendResponse: false,
		})
	)

	app.enableCors({
		origin: process.env.REACT_APP_URL,
		credentials: true,
		allowedHeaders: [
			'Accept',
			'Authorization',
			'Content-Type',
			'X-Requested-With',
			'apollo-require-preflight',
		],
		methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
	})

	app.use(cookieParser())
	app.disable('x-powered-by')
	app.setGlobalPrefix('api')

	await app.listen(process.env.PORT)
}
bootstrap()
