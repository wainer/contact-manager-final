import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/app/lib/auth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const phone = searchParams.get('phone')
    const excludeId = searchParams.get('excludeId') // Para validación en edición

    if (email) {
      const existingContact = await prisma.contact.findFirst({
        where: { 
          email,
          userId: user.userId,
          ...(excludeId && { NOT: { id: excludeId } })
        }
      })
      
      if (existingContact) {
        return NextResponse.json(
          { error: 'Ya existe un contacto con este email' },
          { status: 409 }
        )
      }
    }

    if (phone) {
      const existingContact = await prisma.contact.findFirst({
        where: { 
          phone,
          userId: user.userId,
          ...(excludeId && { NOT: { id: excludeId } })
        }
      })
      
      if (existingContact) {
        return NextResponse.json(
          { error: 'Ya existe un contacto con este teléfono' },
          { status: 409 }
        )
      }
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error('Error validando contacto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}