import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const { pathname } = request.nextUrl

  console.log('🛡️ Middleware ejecutándose para:', pathname, 'Token:', !!token)

  // Solo proteger rutas de API de contactos
  if (pathname.startsWith('/api/contacts') && !token) {
    console.log('🚫 Acceso denegado a API contacts')
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // Redirigir al dashboard si ya está autenticado y está en login
  if (pathname === '/login' && token) {
    console.log('🔄 Redirigiendo a dashboard desde login')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/contacts/:path*',
    '/login'
  ]
}