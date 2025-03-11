import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Перевіряємо наявність необхідних змінних середовища
const getRequiredEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable ${name} is missing`);
  }
  return value;
};

// Отримуємо змінні середовища
const ADMIN_PASSWORD = getRequiredEnvVar('ADMIN_PASSWORD');
const ADMIN_EMAIL = getRequiredEnvVar('ADMIN_EMAIL');
const ADMIN_NAME = getRequiredEnvVar('ADMIN_NAME');

async function main() {
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);

  // Шукаємо існуючого користувача
  const existingUser = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  let admin;
  if (existingUser) {
    // Оновлюємо існуючого користувача
    admin = await prisma.user.update({
      where: { email: ADMIN_EMAIL },
      data: {
        name: ADMIN_NAME,
        passwordHash,
        role: UserRole.ADMIN,
      },
    });
    console.log('Updated existing admin user:', {
      ...admin,
      passwordHash: '[HIDDEN]',
    });
  } else {
    // Створюємо нового користувача
    admin = await prisma.user.create({
      data: {
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        passwordHash,
        role: UserRole.ADMIN,
      },
    });
    console.log('Created new admin user:', {
      ...admin,
      passwordHash: '[HIDDEN]',
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 