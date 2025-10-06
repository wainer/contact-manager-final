'use client'

import { Contact } from '../context/ContactContext'
import Button from './Button'

interface ContactTableProps {
  contacts: Contact[]
  onEdit: (contact: Contact) => void
  onDelete: (id: string) => void
  loading?: boolean
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize?: number
}

export default function ContactTable({
  contacts,
  onEdit,
  onDelete,
  loading = false,
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 5
}: ContactTableProps) {
  // Calcular índices para mostrar información de paginación
  const startIndex = (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(currentPage * pageSize, contacts.length)
  const totalContacts = contacts.length

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <div className="text-gray-500">Cargando contactos...</div>
        </div>
      </div>
    )
  }

  if (contacts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <div className="text-gray-500 mb-4">No hay contactos registrados</div>
          <div className="text-sm text-gray-400">
            Comienza agregando tu primer contacto
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Información de paginación */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Mostrando <span className="font-semibold">{startIndex}-{endIndex}</span> de{' '}
            <span className="font-semibold">{totalContacts}</span> contactos
          </div>
          <div className="text-sm text-gray-500">
            Página <span className="font-semibold">{currentPage}</span> de{' '}
            <span className="font-semibold">{totalPages}</span>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dirección
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Creación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {contact.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{contact.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{contact.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {contact.address || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(contact.createdAt).toLocaleDateString('es-ES')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() => onEdit(contact)}
                    className="text-xs"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => onDelete(contact.id)}
                    className="text-xs"
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-between items-center">
            {/* Botón anterior */}
            <Button
              variant="secondary"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2"
            >
              ← Anterior
            </Button>

            {/* Números de página */}
            <div className="hidden md:flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "primary" : "secondary"}
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-1 text-sm ${
                    page === currentPage 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>

            {/* Indicador móvil */}
            <div className="md:hidden text-sm text-gray-700">
              Página {currentPage} de {totalPages}
            </div>

            {/* Botón siguiente */}
            <Button
              variant="secondary"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2"
            >
              Siguiente →
            </Button>
          </div>
        </div>

        {/* Selector de tamaño de página (opcional) */}
        <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600">
          <span>Contactos por página:</span>
          <select 
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            onChange={(e) => onPageChange(1)} // Resetear a primera página al cambiar tamaño
          >
            <option value="3">3</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  )
}