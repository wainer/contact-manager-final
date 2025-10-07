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
  
  // Estados para validación
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [validating, setValidating] = useState(false)

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
  }, [contact, initialDataLoaded])

  // Validación en tiempo real para email y teléfono
  useEffect(() => {
    const validateField = async (field: 'email' | 'phone', value: string) => {
      if (!value.trim() || value === contact?.[field]) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
        return
      }

      setValidating(true)
      
      try {
        const token = localStorage.getItem('auth-token')
        const params = new URLSearchParams({
          [field]: value,
          ...(contact?.id && { excludeId: contact.id })
        })

        const response = await fetch(`/api/contacts/validate?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.status === 409) {
          const data = await response.json()
          setErrors(prev => ({ ...prev, [field]: data.error }))
        } else {
          setErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors[field]
            return newErrors
          })
        }
      } catch (error) {
        console.error('Error validando campo:', error)
      } finally {
        setValidating(false)
      }
    }

    // Debounce para validación
    const timeoutId = setTimeout(() => {
      if (formData.email && formData.email !== contact?.email) {
        validateField('email', formData.email)
      }
      if (formData.phone && formData.phone !== contact?.phone) {
        validateField('phone', formData.phone)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [formData.email, formData.phone, contact])

  // Resetear el estado cuando el modal se cierra completamente
  useEffect(() => {
    if (!contact && initialDataLoaded) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: ''
      })
      setErrors({})
    }
  }, [contact, initialDataLoaded])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validaciones básicas
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // No enviar si hay errores de duplicados
    if (errors.email || errors.phone) {
      return
    }

    console.log('📤 Enviando formulario:', formData)
    onSubmit(formData)
  }

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    console.log(`✏️ Cambiando ${field}:`, value)
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleCancel = () => {
    setInitialDataLoaded(false) // Resetear para la próxima vez
    setErrors({}) // Limpiar errores
    onCancel()
  }

  const getFieldStatus = (field: string) => {
    if (validating && (field === 'email' || field === 'phone')) {
      return 'validating'
    }
    if (errors[field]) {
      return 'error'
    }
    if (formData[field as keyof ContactFormData] && !errors[field]) {
      return 'success'
    }
    return ''
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre"
        value={formData.name}
        onChange={(value) => handleInputChange('name', value)}
        placeholder="Juan Pérez"
        required
        error={errors.name}
      />
      
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(value) => handleInputChange('email', value)}
        placeholder="juan@example.com"
        required
        error={errors.email}
        status={getFieldStatus('email')}
        validating={validating && getFieldStatus('email') === 'validating'}
      />
      
      <Input
        label="Teléfono"
        value={formData.phone}
        onChange={(value) => handleInputChange('phone', value)}
        placeholder="+1234567890"
        required
        error={errors.phone}
        status={getFieldStatus('phone')}
        validating={validating && getFieldStatus('phone') === 'validating'}
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
          disabled={loading || validating || Object.keys(errors).length > 0}
        >
          {loading ? 'Guardando...' : (contact?.id ? 'Actualizar' : 'Crear')}
        </Button>
      </div>
    </form>
  )
}