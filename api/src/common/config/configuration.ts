export interface AppConfig {
  port: number;
  corsOrigin: string;
  jwtSecret: string;
  jwtExpiresIn: string;
}

export const configuration = (): AppConfig => ({
  port: parseInt(process.env.PORT || '3001', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'questfy-dev-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
});
