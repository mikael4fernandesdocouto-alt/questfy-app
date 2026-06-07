// Production environment config
// This file is used when .env is not present (e.g., in Docker/cloud deployments)

module.exports = {
  // Database - will be set via DATABASE_URL env var
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'questfy-production-secret-change-this',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Server
  PORT: parseInt(process.env.PORT, 10) || 3001,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://mikael4fernandesdocouto-alt.github.io',
};
