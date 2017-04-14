const config = {
  environment: process.env.NODE_ENV ? process.env.NODE_ENV : 'local',
  name: 'expressjs-starter-pack',
  port: process.env.PORT ? process.env.PORT : 0,
};

export default config;
