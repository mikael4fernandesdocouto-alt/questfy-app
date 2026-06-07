export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  database: { url: process.env.DATABASE_URL },
  app: {
    jwtSecret: process.env.JWT_SECRET || 'questfy-secret-change-me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
});
