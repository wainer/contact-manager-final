import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/app/lib/auth'

const prisma = new PrismaClient()

// GET /api/contacts - Obtener todos los contactos del usuario
export async function GET(request: NextRequest) {
  try {
    console.log('📥 Solicitud GET a /api/contacts')
    
    const user = await verifyToken(request)
    console.log('👤 Usuario verificado:', user?.userId)
    
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const contacts = await prisma.contact.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`✅ Encontrados ${contacts.length} contactos para usuario ${user.userId}`)
    
    return NextResponse.json(contacts)
  } catch (error) {
    console.error('🚨 Error en GET /api/contacts:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/contacts - Crear nuevo contacto
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { name, email, phone, address } = await request.json()

    // Validaciones
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Nombre, email y teléfono son requeridos' },
        { status: 400 }
      )
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        address: address || '',
        userId: user.userId
      }
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    console.error('Create contact error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}