'use client'

import { memo } from 'react'

interface InputProps {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
  error?: string
  status?: 'error' | 'success' | 'validating' | ''
  validating?: boolean
}

function InputComponent({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  className = '',
  error,
  status = '',
  validating = false
}: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const getInputClasses = () => {
    let baseClasses = "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
    
    if (status === 'error' || error) {
      return `${baseClasses} border-red-300 focus:ring-red-500 bg-red-50`
    } else if (status === 'success') {
      return `${baseClasses} border-green-300 focus:ring-green-500 bg-green-50`
    } else if (status === 'validating') {
      return `${baseClasses} border-blue-300 focus:ring-blue-500 bg-blue-50`
    } else {
      return `${baseClasses} border-gray-300 focus:ring-blue-500 focus:border-blue-500`
    }
  }

  const getStatusIcon = () => {
    if (validating) {
      return (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )
    } else if (status === 'success') {
      return (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )
    } else if (status === 'error') {
      return (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )
    }
    return null
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={getInputClasses()}
        />
        {getStatusIcon()}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}

// Usar memo para prevenir re-renders innecesarios
export default memo(InputComponent)