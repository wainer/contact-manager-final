'use client'

import { useState, useEffect } from 'react'
import Input from './Input'
import Button from './Button'

export interface ContactFormData {
  name: string
  email: string
  phone: string
  address: string
}

interface ContactFormProps {
  contact?: ContactFormData & { id?: string }
  onSubmit: (data: ContactFormData) => void
  onCancel: () => void
  loading?: boolean
}

export default function ContactForm({
  contact,
  onSubmit,
  onCancel,
  loading = false
}: ContactFormProps) {
  // Estado interno del formulario
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    address: ''
  })

  // Estado para controlar si ya se cargaron los datos iniciales
  const [initialDataLoaded, setInitialDataLoaded] = useState(false)

  // Efecto para cargar datos iniciales UNA SOLA VEZ
  useEffect(() => {
    if (contact && !initialDataLoaded) {
      console.log('📝 Cargando datos iniciales del contacto:', contact)
      setFormData({
        name: contact.name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        address: contact.address || ''
      })
      setInitialDataLoaded(true)
    } else if (!contact) {
      // Resetear para modo creación
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: ''
      })
      setInitialDataLoaded(true)
    }
  }, [contact, initialDataLoaded]) // Solo depende de contact y initialDataLoaded

  // Resetear el estado cuando el modal se cierra completamente
  useEffect(() => {
    if (!contact && initialDataLoaded) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: ''
      })
    }
  }, [contact, initialDataLoaded])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('📤 Enviando formulario:', formData)
    onSubmit(formData)
  }

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    console.log(`✏️ Cambiando ${field}:`, value)
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCancel = () => {
    setInitialDataLoaded(false) // Resetear para la próxima vez
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre"
        value={formData.name}
        onChange={(value) => handleInputChange('name', value)}
        placeholder="Juan Pérez"
        required
      />
      
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(value) => handleInputChange('email', value)}
        placeholder="juan@example.com"
        required
      />
      
      <Input
        label="Teléfono"
        value={formData.phone}
        onChange={(value) => handleInputChange('phone', value)}
        placeholder="+1234567890"
        required
      />
      
      <Input
        label="Dirección"
        value={formData.address}
        onChange={(value) => handleInputChange('address', value)}
        placeholder="Calle Principal 123"
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Guardando...' : (contact?.id ? 'Actualizar' : 'Crear')}
        </Button>
      </div>
    </form>
  )
}