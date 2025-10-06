'use client'

import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  action?: ReactNode
}

export default function Layout({ children, title, subtitle, action }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">
              📒 Gestor de Contactos
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600">{subtitle}</p>
            )}
          </div>
          {action}
        </div>

        {children}
      </main>
    </div>
  )
}