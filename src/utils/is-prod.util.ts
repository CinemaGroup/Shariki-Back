import { ConfigService } from '@nestjs/config'

export const isProd = (configService: ConfigService) => {
	return configService.get('NODE_ENV') === 'production'
}
