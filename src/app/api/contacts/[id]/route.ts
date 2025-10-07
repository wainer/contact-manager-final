import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/app/lib/auth'

const prisma = new PrismaClient()

// PUT /api/contacts/[id] - Actualizar contacto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { name, email, phone, address } = await request.json()

    // Verificar que el contacto pertenece al usuario
    const existingContact = await prisma.contact.findFirst({
      where: { id: params.id, userId: user.userId }
    })

    if (!existingContact) {
      return NextResponse.json({ error: 'Contacto no encontrado' }, { status: 404 })
    }

    // Validar email único (excluyendo el contacto actual)
    if (email !== existingContact.email) {
      const existingEmail = await prisma.contact.findFirst({
        where: { 
          email,
          userId: user.userId,
          NOT: { id: params.id }
        }
      })

      if (existingEmail) {
        return NextResponse.json(
          { error: 'Ya existe un contacto con este email' },
          { status: 400 }
        )
      }
    }

    // Validar teléfono único (excluyendo el contacto actual)
    if (phone !== existingContact.phone) {
      const existingPhone = await prisma.contact.findFirst({
        where: { 
          phone,
          userId: user.userId,
          NOT: { id: params.id }
        }
      })

      if (existingPhone) {
        return NextResponse.json(
          { error: 'Ya existe un contacto con este teléfono' },
          { status: 400 }
        )
      }
    }

    const contact = await prisma.contact.update({
      where: { id: params.id },
      data: { name, email, phone, address: address || '' }
    })

    console.log('✅ Contacto actualizado exitosamente:', contact.id)
    return NextResponse.json(contact)
  } catch (error) {
    console.error('Update contact error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/contacts/[id] - Eliminar contacto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que el contacto pertenece al usuario
    const existingContact = await prisma.contact.findFirst({
      where: { id: params.id, userId: user.userId }
    })

    if (!existingContact) {
      return NextResponse.json({ error: 'Contacto no encontrado' }, { status: 404 })
    }

    await prisma.contact.delete({
      where: { id: params.id }
    })

    console.log('✅ Contacto eliminado exitosamente:', params.id)
    return NextResponse.json({ message: 'Contacto eliminado' })
  } catch (error) {
    console.error('Delete contact error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}