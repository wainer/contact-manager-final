import { useState, useMemo } from 'react'
import { Contact } from '../context/ContactContext'
import { FilterOptions } from '../components/ContactFilters'

export function useContactSearch(contacts: Contact[]) {
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    sortBy: 'name',
    sortOrder: 'asc'
  })

  // Filtrar y ordenar contactos
  const filteredAndSortedContacts = useMemo(() => {
    let result = [...contacts]

    // Aplicar búsqueda
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim()
      result = result.filter(contact =>
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.phone.toLowerCase().includes(query) ||
        (contact.address && contact.address.toLowerCase().includes(query))
      )
    }

    // Aplicar ordenamiento
    result.sort((a, b) => {
      let aValue: string | number = a[filters.sortBy] || ''
      let bValue: string | number = b[filters.sortBy] || ''

      // Convertir fechas para ordenamiento
      if (filters.sortBy === 'createdAt') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [contacts, filters])

  // Estadísticas de búsqueda
  const searchStats = useMemo(() => {
    const total = contacts.length
    const filtered = filteredAndSortedContacts.length
    const hasSearch = filters.searchQuery.trim() !== ''

    return {
      total,
      filtered,
      hasSearch,
      isFiltered: hasSearch || filtered !== total
    }
  }, [contacts.length, filteredAndSortedContacts.length, filters.searchQuery])

  return {
    filters,
    setFilters,
    filteredContacts: filteredAndSortedContacts,
    searchStats
  }
}