import { ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'
import { isDev } from 'src/utils/is-dev.util'

export const getGraphQLConfig = async (
	configService: ConfigService
): Promise<ApolloDriverConfig> => ({
	playground: isDev(configService),
	autoSchemaFile: join(process.cwd(), 'src/schema/schema.gql'),
	context: ({ req, res }) => ({
		req,
		res,
	}),
	sortSchema: true,
})
