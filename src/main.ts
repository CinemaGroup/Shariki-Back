import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)
	
	app.enableCors({
		origin: process.env.REACT_APP_URL,
		credentials: true,
	})
	app.use(cookieParser())
	app.disable('x-powered-by')
	app.setGlobalPrefix('api')
	await app.listen(process.env.PORT)
}
bootstrap()
