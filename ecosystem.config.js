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
      },
    },
  ],
};