'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('auth-token')
        const userData = localStorage.getItem('user-data')
        
        console.log('🔐 Verificando autenticación:', { token, userData })
        
        if (token && userData) {
          const user = JSON.parse(userData)
          console.log('✅ Usuario autenticado:', user)
          setUser(user)
        } else {
          console.log('❌ No hay token o datos de usuario')
          setUser(null)
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🚀 Intentando login con:', email)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      console.log('📨 Respuesta del login:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Login exitoso:', data.user)
        
        localStorage.setItem('auth-token', data.token)
        localStorage.setItem('user-data', JSON.stringify(data.user))
        setUser(data.user)
        
        // Cookie para middleware
        document.cookie = `auth-token=${data.token}; path=/; max-age=604800`
        
        return true
      } else {
        const errorData = await response.json()
        console.error('❌ Error en login:', errorData)
        return false
      }
    } catch (error) {
      console.error('🚨 Error de conexión en login:', error)
      return false
    }
  }

  const logout = () => {
    console.log('👋 Cerrando sesión')
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user-data')
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}