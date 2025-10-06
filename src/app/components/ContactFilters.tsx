'use client'

import { useState } from 'react'
import SearchBar from './SearchBar'

export interface FilterOptions {
  searchQuery: string
  sortBy: 'name' | 'email' | 'createdAt' | 'phone'
  sortOrder: 'asc' | 'desc'
}

interface ContactFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void
  resultsCount: number
  totalCount: number
}

export default function ContactFilters({ 
  onFiltersChange, 
  resultsCount, 
  totalCount 
}: ContactFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    sortBy: 'name',
    sortOrder: 'asc'
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleSearch = (query: string) => {
    handleFilterChange('searchQuery', query)
  }

  const clearAll = () => {
    const defaultFilters: FilterOptions = {
      searchQuery: '',
      sortBy: 'name',
      sortOrder: 'asc'
    }
    setFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow border space-y-4">
      {/* Barra de búsqueda principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Buscar por nombre, email, teléfono..."
          />
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Contador de resultados */}
          <div className="text-sm text-gray-600 whitespace-nowrap">
            <span className="font-semibold">{resultsCount}</span> de{' '}
            <span className="font-semibold">{totalCount}</span> contactos
          </div>

          {/* Botón filtros avanzados */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            <span>Filtros</span>
          </button>

          {/* Botón limpiar */}
          {(filters.searchQuery || filters.sortBy !== 'name' || filters.sortOrder !== 'asc') && (
            <button
              onClick={clearAll}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Filtros avanzados */}
      {showAdvanced && (
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ordenamiento */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Ordenar por
              </label>
              <div className="flex space-x-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Nombre</option>
                  <option value="email">Email</option>
                  <option value="phone">Teléfono</option>
                  <option value="createdAt">Fecha creación</option>
                </select>
                
                <button
                  onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  title={filters.sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
                >
                  {filters.sortOrder === 'asc' ? 'A→Z' : 'Z→A'}
                </button>
              </div>
            </div>

            {/* Información de búsqueda */}
            <div className="flex items-center justify-end">
              {filters.searchQuery && (
                <div className="text-sm text-gray-600">
                  Búsqueda: <span className="font-semibold">"{filters.searchQuery}"</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}