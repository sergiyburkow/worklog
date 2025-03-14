import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  database: {
    url: process.env.DATABASE_URL || 'postgresql://maestro@localhost:5432/worklog?schema=public'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
  },
  server: {
    host: process.env.HOST || 'localhost',
    port: parseInt(process.env.PORT || '3001'),
    protocol: process.env.PROTOCOL || 'http'
  },
  admin: {
    password: process.env.ADMIN_PASSWORD || '123456',
    email: process.env.ADMIN_EMAIL || 'cray@sscgroup.net',
    name: process.env.ADMIN_NAME || 'Сергій'
  }
}; 