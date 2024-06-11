module.exports = {
	apps: [
		{
			name: 'nest-app',
			script: 'yarn',
			args: 'start',
			watch: true,
			ignore_watch: ['node_modules', 'logs', 'src/schema/schema.gql'],
			env: {
				NODE_ENV: 'production',
				REACT_APP_URL: 'https://xn--80aiifgeteakjch.xn--p1ai',
				DOMAIN: 'xn--80aiifgeteakjch.xn--p1ai',
				PORT: '8800',
				EMAIL_SERVICE: 'beget',
				EMAIL_HOST: 'smtp.beget.com',
				EMAIL_PORT: '465',
				EMAIL_USER: 'support@скоропраздник.рф',
				EMAIL_PASSWORD: 'Koribla-1',
				EMAIL_ADMIN: 'skoroprazdnik@inbox.ru',
			},
		},
	],
}
