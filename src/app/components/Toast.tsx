'use client'

import { useEffect, useState } from 'react'
import { Toast as ToastType } from '../types/notifications'

interface ToastProps {
  toast: ToastType
  onClose: (id: string) => void
}

export default function Toast({ toast, onClose }: ToastProps) {
  const [isLeaving, setIsLeaving] = useState(false)
  const duration = toast.duration || 5000

  // Auto-close
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose(toast.id)
    }, 300)
  }

  // Iconos para cada tipo
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'error':
        return (
          <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      case 'warning':
        return (
          <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      case 'info':
        return (
          <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  // Colores para cada tipo
  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className={`
      transform transition-all duration-300 ease-in-out
      ${isLeaving ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      w-full max-w-sm mb-3
    `}>
      <div className={`
        relative flex items-start p-4 rounded-lg border shadow-sm
        ${getStyles()}
      `}>
        {/* Icono */}
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>

        {/* Contenido */}
        <div className="ml-3 flex-1">
          <div className="text-sm font-medium text-gray-900">
            {toast.title}
          </div>
          {toast.message && (
            <div className="mt-1 text-sm text-gray-600">
              {toast.message}
            </div>
          )}
        </div>

        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-4 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Barra de progreso (opcional) */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
            <div 
              className={`h-full ${
                toast.type === 'success' ? 'bg-green-400' :
                toast.type === 'error' ? 'bg-red-400' :
                toast.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
              } transition-all duration-${duration} ease-linear`}
              style={{ 
                width: isLeaving ? '0%' : '100%',
                transition: `width ${duration}ms linear`
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}