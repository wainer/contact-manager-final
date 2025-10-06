import { useToast } from '../context/ToastContext'

export function useNotifications() {
  const { addToast } = useToast()

  const showSuccess = (title: string, message?: string) => {
    addToast({
      type: 'success',
      title,
      message,
      duration: 5000
    })
  }

  const showError = (title: string, message?: string) => {
    addToast({
      type: 'error',
      title,
      message,
      duration: 7000
    })
  }

  const showWarning = (title: string, message?: string) => {
    addToast({
      type: 'warning',
      title,
      message,
      duration: 6000
    })
  }

  const showInfo = (title: string, message?: string) => {
    addToast({
      type: 'info',
      title,
      message,
      duration: 4000
    })
  }

  // Notificaciones específicas para operaciones CRUD
  const showCreateSuccess = (entity: string = 'Contacto') => {
    showSuccess(`${entity} creado`, `El ${entity.toLowerCase()} se ha creado exitosamente`)
  }

  const showUpdateSuccess = (entity: string = 'Contacto') => {
    showSuccess(`${entity} actualizado`, `El ${entity.toLowerCase()} se ha actualizado exitosamente`)
  }

  const showDeleteSuccess = (entity: string = 'Contacto') => {
    showSuccess(`${entity} eliminado`, `El ${entity.toLowerCase()} se ha eliminado exitosamente`)
  }

  const showCreateError = (entity: string = 'Contacto', error?: string) => {
    showError(`Error al crear ${entity.toLowerCase()}`, error || 'Ha ocurrido un error inesperado')
  }

  const showUpdateError = (entity: string = 'Contacto', error?: string) => {
    showError(`Error al actualizar ${entity.toLowerCase()}`, error || 'Ha ocurrido un error inesperado')
  }

  const showDeleteError = (entity: string = 'Contacto', error?: string) => {
    showError(`Error al eliminar ${entity.toLowerCase()}`, error || 'Ha ocurrido un error inesperado')
  }

  const showLoadError = (entity: string = 'Contactos', error?: string) => {
    showError(`Error al cargar ${entity.toLowerCase()}`, error || 'No se pudieron cargar los datos')
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showCreateSuccess,
    showUpdateSuccess,
    showDeleteSuccess,
    showCreateError,
    showUpdateError,
    showDeleteError,
    showLoadError
  }
}