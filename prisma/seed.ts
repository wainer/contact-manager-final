import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Limpiar base de datos primero (opcional para PostgreSQL)
  await prisma.contact.deleteMany()
  await prisma.user.deleteMany()

  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const user = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Administrador',
      contacts: {
        create: [
          {
            name: 'Juan Pérez',
            email: 'juan@example.com',
            phone: '+1234567890',
            address: 'Calle Principal 123',
          },
          {
            name: 'María García',
            email: 'maria@example.com', 
            phone: '+0987654321',
            address: 'Avenida Central 456',
          },
        ],
      },
    },
  })

  console.log('✅ User created:', user.email)
  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })