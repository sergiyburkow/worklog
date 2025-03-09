const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const user = await prisma.user.update({
    where: {
      email: 'cray@sscgroup.net'
    },
    data: {
      passwordHash: hashedPassword
    }
  });
  
  console.log('Updated user:', user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()); 