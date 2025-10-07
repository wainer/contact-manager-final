'use client'

import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
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

// Crear instancia de SweetAlert2 con soporte para React
const MySwal = withReactContent(Swal)

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

  // Función para confirmar cierre de sesión
  const handleLogout = async () => {
    const result = await MySwal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas cerrar tu sesión?',
      icon: 'question',
      iconColor: '#6366f1',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      background: '#ffffff',
      color: '#1f2937',
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
        title: 'text-xl font-semibold text-gray-900',
        htmlContainer: 'text-gray-600',
        confirmButton: 'px-6 py-2 rounded-lg font-medium',
        cancelButton: 'px-6 py-2 rounded-lg font-medium'
      }
    })

    if (result.isConfirmed) {
      console.log('🚪 Confirmado cierre de sesión')
      logout()
    }
  }

  // Función para confirmar eliminación de contacto
  const handleDeleteContact = async (id: string, contactName: string) => {
    const result = await MySwal.fire({
      title: '¿Eliminar contacto?',
      html: (
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-2">¿Estás seguro de eliminar este contacto?</p>
          <p className="text-gray-600 mb-1">Contacto: <span className="font-medium text-gray-800">{contactName}</span></p>
          <p className="text-sm text-red-600 font-medium">Esta acción no se puede deshacer</p>
        </div>
      ),
      icon: 'warning',
      iconColor: '#ef4444',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#ffffff',
      color: '#1f2937',
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
        title: 'hidden',
        htmlContainer: 'text-center',
        confirmButton: 'px-6 py-2 rounded-lg font-medium hover:bg-red-700',
        cancelButton: 'px-6 py-2 rounded-lg font-medium'
      }
    })

    if (result.isConfirmed) {
      console.log('🗑️ Confirmada eliminación del contacto:', id)
      await performDeleteContact(id)
    }
  }

  // Función que realiza la eliminación del contacto
  const performDeleteContact = async (id: string) => {
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
        
        // Mostrar confirmación de eliminación exitosa
        MySwal.fire({
          title: '¡Eliminado!',
          text: 'El contacto ha sido eliminado correctamente',
          icon: 'success',
          iconColor: '#10b981',
          confirmButtonColor: '#10b981',
          confirmButtonText: 'Aceptar',
          background: '#ffffff',
          customClass: {
            popup: 'rounded-2xl shadow-2xl',
            title: 'text-lg font-semibold text-gray-900',
            confirmButton: 'px-6 py-2 rounded-lg font-medium'
          }
        })
      } else {
        const errorData = await response.json()
        console.error('❌ Error eliminando contacto:', errorData)
        showDeleteError('Contacto', errorData.error)
        
        // Mostrar error de eliminación
        MySwal.fire({
          title: 'Error',
          text: `No se pudo eliminar el contacto: ${errorData.error}`,
          icon: 'error',
          iconColor: '#ef4444',
          confirmButtonColor: '#ef4444',
          confirmButtonText: 'Aceptar',
          background: '#ffffff',
          customClass: {
            popup: 'rounded-2xl shadow-2xl',
            title: 'text-lg font-semibold text-gray-900'
          }
        })
      }
    } catch (error) {
      console.error('🚨 Error de conexión:', error)
      showDeleteError('Contacto', 'Error de conexión')
      
      // Mostrar error de conexión
      MySwal.fire({
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor',
        icon: 'error',
        iconColor: '#ef4444',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Aceptar',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          title: 'text-lg font-semibold text-gray-900'
        }
      })
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
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Verificando autenticación...</div>
        </div>
      </div>
    )
  }

  // Si no hay usuario después de terminar loading, mostrar mensaje
  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-pulse">
            <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="text-lg text-gray-600">Redirigiendo al login...</div>
        </div>
      </div>
    )
  }

  return (
    <Layout
      title={
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Contactos</h1>
            <p className="text-sm text-gray-500">Gestiona tu lista de contactos</p>
          </div>
        </div>
      }
      action={
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">{user.name}</span>
          </div>
          <Button
            onClick={() => {
              console.log('➕ Abriendo modal para crear contacto')
              setShowForm(true)
              setEditingContact(null)
            }}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nuevo Contacto</span>
          </Button>
          <Button 
            variant="danger" 
            onClick={handleLogout}
            className="flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Cerrar Sesión</span>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{searchStats.total}</div>
              <div className="text-blue-100 text-sm">Total Contactos</div>
            </div>
            <div className="p-3 bg-blue-400/20 rounded-xl">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{pageSize}</div>
              <div className="text-green-100 text-sm">
                {searchStats.isFiltered ? 'Resultados' : 'Mostrando'}
              </div>
            </div>
            <div className="p-3 bg-green-400/20 rounded-xl">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{currentPage}</div>
              <div className="text-purple-100 text-sm">Página Actual</div>
            </div>
            <div className="p-3 bg-purple-400/20 rounded-xl">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{totalPages}</div>
              <div className="text-orange-100 text-sm">Total Páginas</div>
            </div>
            <div className="p-3 bg-orange-400/20 rounded-xl">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Información de búsqueda activa */}
      {searchStats.isFiltered && (
        <div className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium">
                {filters.searchQuery ? (
                  <>Mostrando <strong>{searchStats.filtered}</strong> de <strong>{searchStats.total}</strong> contactos para "<strong>{filters.searchQuery}</strong>"</>
                ) : (
                  <>Mostrando <strong>{searchStats.filtered}</strong> contactos ordenados por <strong>{filters.sortBy}</strong> ({filters.sortOrder === 'asc' ? 'ascendente' : 'descendente'})</>
                )}
              </span>
            </div>
            <button
              onClick={() => setFilters({ searchQuery: '', sortBy: 'name', sortOrder: 'asc' })}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Limpiar filtros</span>
            </button>
          </div>
        </div>
      )}

      {/* Selector de tamaño de página */}
      <div className="mb-6 flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            <span>Mostrar:</span>
          </label>
          <select 
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="3">3 contactos</option>
            <option value="5">5 contactos</option>
            <option value="10">10 contactos</option>
            <option value="20">20 contactos</option>
          </select>
        </div>
        
        <div className="text-sm text-gray-600 flex items-center space-x-2">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {totalContacts > 0 ? (
            <span>Mostrando <strong className="text-gray-800">{startIndex + 1}-{Math.min(startIndex + pageSize, totalContacts)}</strong> de <strong className="text-gray-800">{totalContacts}</strong> contactos</span>
          ) : (
            <span>No hay contactos que coincidan</span>
          )}
        </div>
      </div>

      {/* Tabla de contactos con paginación */}
      <ContactTable
        contacts={paginatedContacts}
        onEdit={handleEdit}
        onDelete={(contact) => handleDeleteContact(contact.id, contact.name)}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        pageSize={pageSize}
      />

      {/* Mensaje de error */}
      {error && (
        <div className="mt-6 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-medium">{error}</p>
          </div>
          <div className="text-center">
            <Button 
              onClick={loadContacts} 
              variant="secondary"
              className="bg-white text-red-600 hover:bg-gray-100"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reintentar
            </Button>
          </div>
        </div>
      )}

      {/* Sin resultados de búsqueda */}
      {!loading && searchStats.isFiltered && searchStats.filtered === 0 && (
        <div className="text-center mt-8 py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="max-w-md mx-auto">
            <div className="p-4 bg-blue-50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <svg className="h-10 w-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No se encontraron contactos</h3>
            <p className="text-gray-500 mb-6">
              No hay contactos que coincidan con "{filters.searchQuery}"
            </p>
            <Button 
              onClick={() => setFilters({ searchQuery: '', sortBy: 'name', sortOrder: 'asc' })}
              variant="secondary"
              className="flex items-center space-x-2 mx-auto"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Ver todos los contactos</span>
            </Button>
          </div>
        </div>
      )}

      {/* Botón para recargar manualmente */}
      {!loading && contacts.length === 0 && !error && !searchStats.isFiltered && (
        <div className="text-center mt-8 py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="max-w-md mx-auto">
            <div className="p-4 bg-gray-50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No hay contactos cargados</h3>
            <p className="text-gray-500 mb-6">Comienza agregando tu primer contacto</p>
            <Button 
              onClick={loadContacts} 
              variant="secondary"
              className="flex items-center space-x-2 mx-auto"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Cargar Contactos</span>
            </Button>
          </div>
        </div>
      )}
    </Layout>
  )
}