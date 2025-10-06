import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
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
          {
            name: 'Carlos Mejia',
            email: 'carlos@example.com',
            phone: '+5551234567',
            address: 'Calle Secundaria 789',
          },
          {
            name: 'Ana López',
            email: 'analopez@gmail.com',
            phone: '+4449876543',
            address: 'Boulevard Norte 321',
          },
          {
            name: 'Roberto Sánchez',
            email: 'robertosan@gmail.com',
            phone: '+3335678901',
            address: 'Plaza Sur 654',
          },
          {
            name: 'Carmen Torres',
            email: 'carmentorres@gmail.com',
            phone: '+2223456789',
            address: 'Calle Este 987',
          },
          {
            name: 'Laura Fernández',
            email: 'laurafer@gmail.com',
            phone: '+1112345678',
            address: 'Avenida Oeste 321',
          },
          {
            name: 'Esteban Ruiz',
            email: 'estebanruiz@gmail.com',
            phone: '+6667890123',
            address: 'Calle Norte 654',
          },
          {
            name: 'Pedro Gómez',
            email: 'pedrogomez@gmail.com',
            phone: '+5558901234',
            address: 'Plaza Central 987',
          },
          {
            name: 'Eva Martínez',
            email: 'evamartinez@gmail.com',
            phone: '+4449012345',
            address: 'Boulevard Sur 123',
          },
        ],
      },
    },
  })

  console.log('✅ User created:', user.email)
  console.log('🎉 Seed completed!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())