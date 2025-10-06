'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useContactSearch } from '../hooks/useContactSearch'
import { useNotifications } from '../hooks/useNotifications'
import Layout from '../components/Layout'
import Button from '../components/Button'
import Modal from '../components/Modal'
import ContactForm, { ContactFormData } from '../components/ContactForm'
import ContactTable from '../components/ContactTable'
import ContactFilters, { FilterOptions } from '../components/ContactFilters'

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  createdAt: string
}

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  
  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(3)

  // Búsqueda y filtrado
  const {
    filters,
    setFilters,
    filteredContacts,
    searchStats
  } = useContactSearch(contacts)

  // Notificaciones
  const {
    showCreateSuccess,
    showUpdateSuccess,
    showDeleteSuccess,
    showCreateError,
    showUpdateError,
    showDeleteError,
    showLoadError,
    showInfo
  } = useNotifications()

  // Calcular contactos paginados
  const totalContacts = filteredContacts.length
  const totalPages = Math.ceil(totalContacts / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedContacts = filteredContacts.slice(startIndex, startIndex + pageSize)

  // Efecto para debuggear la edición
  useEffect(() => {
    if (editingContact) {
      console.log('🎯 Contacto en modo edición:', editingContact)
    }
  }, [editingContact])

  // Cargar contactos cuando el usuario esté autenticado
  useEffect(() => {
    if (user && !authLoading) {
      console.log('👤 Usuario autenticado, cargando contactos...')
      loadContacts()
    }
  }, [user, authLoading])

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('🚫 No autenticado, redirigiendo a login...')
      window.location.href = '/login'
    }
  }, [user, authLoading])

  // Resetear a página 1 cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [filters.searchQuery, filters.sortBy, filters.sortOrder])

  // Resetear a página 1 cuando cambien los contactos filtrados
  useEffect(() => {
    if (filteredContacts.length > 0) {
      const newTotalPages = Math.ceil(filteredContacts.length / pageSize)
      if (currentPage > newTotalPages) {
        setCurrentPage(1)
      }
    }
  }, [filteredContacts, pageSize])

  const loadContacts = async () => {
    console.log('📥 Cargando contactos...')
    setLoading(true)
    setError(null)
    
    try {
      const token = localStorage.getItem('auth-token')
      console.log('🔑 Token disponible:', !!token)
      
      const response = await fetch('/api/contacts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('📨 Respuesta de API:', response.status)

      if (response.ok) {
        const contactsData = await response.json()
        console.log('✅ Contactos cargados:', contactsData.length)
        setContacts(contactsData)
        
        if (contactsData.length > 0) {
          showInfo('Contactos cargados', `Se cargaron ${contactsData.length} contactos exitosamente`)
        }
      } else {
        const errorText = await response.text()
        console.error('❌ Error cargando contactos:', errorText)
        setError('Error al cargar contactos')
        showLoadError('Contactos', 'No se pudieron cargar los contactos')
      }
    } catch (error) {
      console.error('🚨 Error de conexión:', error)
      setError('Error de conexión')
      showLoadError('Contactos', 'Error de conexión al cargar los contactos')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateContact = async (formData: ContactFormData) => {
    setFormLoading(true)
    console.log('➕ Creando contacto:', formData)
    
    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const newContact = await response.json()
        console.log('✅ Contacto creado:', newContact)
        setContacts(prev => [newContact, ...prev])
        setShowForm(false)
        showCreateSuccess('Contacto')
      } else {
        const errorData = await response.json()
        console.error('❌ Error creando contacto:', errorData)
        showCreateError('Contacto', errorData.error)
      }
    } catch (error) {
      console.error('🚨 Error de conexión:', error)
      showCreateError('Contacto', 'Error de conexión')
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateContact = async (formData: ContactFormData) => {
    if (!editingContact) return

    setFormLoading(true)
    console.log('✏️ Actualizando contacto:', editingContact.id)
    
    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch(`/api/contacts/${editingContact.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updatedContact = await response.json()
        console.log('✅ Contacto actualizado:', updatedContact)
        setContacts(prev => 
          prev.map(contact => 
            contact.id === editingContact.id ? updatedContact : contact
          )
        )
        setEditingContact(null)
        showUpdateSuccess('Contacto')
      } else {
        const errorData = await response.json()
        console.error('❌ Error actualizando contacto:', errorData)
        showUpdateError('Contacto', errorData.error)
      }
    } catch (error) {
      console.error('🚨 Error de conexión:', error)
      showUpdateError('Contacto', 'Error de conexión')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteContact = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
      return
    }

    console.log('🗑️ Eliminando contacto:', id)
    
    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        console.log('✅ Contacto eliminado')
        setContacts(prev => prev.filter(contact => contact.id !== id))
        showDeleteSuccess('Contacto')
      } else {
        const errorData = await response.json()
        console.error('❌ Error eliminando contacto:', errorData)
        showDeleteError('Contacto', errorData.error)
      }
    } catch (error) {
      console.error('🚨 Error de conexión:', error)
      showDeleteError('Contacto', 'Error de conexión')
    }
  }

  const handleEdit = (contact: Contact) => {
    console.log('📝 Iniciando edición del contacto:', contact)
    setEditingContact(contact)
  }

  const handleCancelEdit = () => {
    console.log('❌ Cancelando edición')
    setEditingContact(null)
    setShowForm(false)
  }

  const handleModalClose = () => {
    console.log('🚪 Cerrando modal')
    setEditingContact(null)
    setShowForm(false)
  }

  const handleFormSubmit = (formData: ContactFormData) => {
    if (editingContact) {
      console.log('💾 Guardando cambios del contacto:', editingContact.id)
      handleUpdateContact(formData)
    } else {
      console.log('➕ Creando nuevo contacto')
      handleCreateContact(formData)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  // Mostrar loading mientras verifica autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg">Verificando autenticación...</div>
      </div>
    )
  }

  // Si no hay usuario después de terminar loading, mostrar mensaje
  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg">Redirigiendo al login...</div>
      </div>
    )
  }

  return (
    <Layout
      title="Mis Contactos"
      subtitle="Gestiona tu lista de contactos"
      action={
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Hola, {user.name}</span>
          <Button
            onClick={() => {
              console.log('➕ Abriendo modal para crear contacto')
              setShowForm(true)
              setEditingContact(null)
            }}
            className="flex items-center space-x-2"
          >
            <span>+</span>
            <span>Nuevo Contacto</span>
          </Button>
          <Button variant="danger" onClick={logout}>
            Cerrar Sesión
          </Button>
        </div>
      }
    >
      {/* Modal para crear/editar contacto */}
      <Modal
        isOpen={showForm || !!editingContact}
        onClose={handleModalClose}
        title={editingContact ? 'Editar Contacto' : 'Nuevo Contacto'}>
        <ContactForm
          key={editingContact?.id || 'create'}
          contact={editingContact ? {
            id: editingContact.id,
            name: editingContact.name,
            email: editingContact.email,
            phone: editingContact.phone,
            address: editingContact.address || ''
          } : undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelEdit}
          loading={formLoading}
        />
      </Modal>

      {/* Filtros y búsqueda */}
      <ContactFilters
        onFiltersChange={handleFiltersChange}
        resultsCount={searchStats.filtered}
        totalCount={searchStats.total}
      />

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-blue-600">{searchStats.total}</div>
          <div className="text-sm text-gray-600">Total Contactos</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">{pageSize}</div>
          <div className="text-sm text-gray-600">
            {searchStats.isFiltered ? 'Resultados' : 'Mostrando'}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-purple-600">{currentPage}</div>
          <div className="text-sm text-gray-600">Página Actual</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-orange-600">{totalPages}</div>
          <div className="text-sm text-gray-600">Total Páginas</div>
        </div>
      </div>

      {/* Información de búsqueda activa */}
      {searchStats.isFiltered && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-blue-800 text-sm">
                {filters.searchQuery ? (
                  <>Mostrando <strong>{searchStats.filtered}</strong> de <strong>{searchStats.total}</strong> contactos para "<strong>{filters.searchQuery}</strong>"</>
                ) : (
                  <>Mostrando <strong>{searchStats.filtered}</strong> contactos ordenados por <strong>{filters.sortBy}</strong> ({filters.sortOrder === 'asc' ? 'ascendente' : 'descendente'})</>
                )}
              </span>
            </div>
            <button
              onClick={() => setFilters({ searchQuery: '', sortBy: 'name', sortOrder: 'asc' })}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* Selector de tamaño de página */}
      <div className="mb-4 flex items-center justify-between bg-white p-4 rounded-lg shadow border">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">
            Mostrar:
          </label>
          <select 
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="3">3 contactos</option>
            <option value="5">5 contactos</option>
            <option value="10">10 contactos</option>
            <option value="20">20 contactos</option>
          </select>
        </div>
        
        <div className="text-sm text-gray-600">
          {totalContacts > 0 ? (
            <>Mostrando <strong>{startIndex + 1}-{Math.min(startIndex + pageSize, totalContacts)}</strong> de <strong>{totalContacts}</strong> contactos</>
          ) : (
            'No hay contactos que coincidan'
          )}
        </div>
      </div>

      {/* Tabla de contactos con paginación */}
      <ContactTable
        contacts={paginatedContacts}
        onEdit={handleEdit}
        onDelete={handleDeleteContact}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        pageSize={pageSize}
      />

      {/* Mensaje de error */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-center">{error}</p>
          <div className="text-center mt-2">
            <Button onClick={loadContacts} variant="secondary">
              Reintentar
            </Button>
          </div>
        </div>
      )}

      {/* Sin resultados de búsqueda */}
      {!loading && searchStats.isFiltered && searchStats.filtered === 0 && (
        <div className="text-center mt-8 py-12">
          <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron contactos</h3>
          <p className="text-gray-500 mb-4">
            No hay contactos que coincidan con "{filters.searchQuery}"
          </p>
          <Button 
            onClick={() => setFilters({ searchQuery: '', sortBy: 'name', sortOrder: 'asc' })}
            variant="secondary"
          >
            Ver todos los contactos
          </Button>
        </div>
      )}

      {/* Botón para recargar manualmente */}
      {!loading && contacts.length === 0 && !error && !searchStats.isFiltered && (
        <div className="text-center mt-8">
          <p className="text-gray-500 mb-4">No hay contactos cargados</p>
          <Button onClick={loadContacts} variant="secondary">
            Cargar Contactos
          </Button>
        </div>
      )}
    </Layout>
  )
}