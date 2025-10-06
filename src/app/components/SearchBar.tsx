'use client'

import { useState, useEffect, useRef } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  delay?: number
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "Buscar contactos...",
  delay = 300 
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const timeoutRef = useRef<any>(null)

  useEffect(() => {
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Configurar nuevo timeout
    timeoutRef.current = setTimeout(() => {
      onSearch(query)
    }, delay)

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [query, delay, onSearch])

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        {/* Icono de búsqueda */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Input de búsqueda */}
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />

        {/* Botón de limpiar */}
        {query && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
              type="button"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}