'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  createdAt: string
}

interface ContactState {
  contacts: Contact[]
  loading: boolean
  error: string | null
}

type ContactAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CONTACTS'; payload: Contact[] }
  | { type: 'ADD_CONTACT'; payload: Contact }
  | { type: 'UPDATE_CONTACT'; payload: Contact }
  | { type: 'DELETE_CONTACT'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null }

const initialState: ContactState = {
  contacts: [],
  loading: false,
  error: null
}

function contactReducer(state: ContactState, action: ContactAction): ContactState {
  console.log('🔄 ContactReducer - Action:', action.type, 'Payload:', action.payload)
  
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_CONTACTS':
      return { 
        ...state, 
        contacts: action.payload, 
        loading: false,
        error: null 
      }
    case 'ADD_CONTACT':
      return { 
        ...state, 
        contacts: [action.payload, ...state.contacts],
        error: null
      }
    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map(contact =>
          contact.id === action.payload.id ? action.payload : contact
        ),
        error: null
      }
    case 'DELETE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.filter(contact => contact.id !== action.payload),
        error: null
      }
    case 'SET_ERROR':
      return { 
        ...state, 
        error: action.payload, 
        loading: false 
      }
    default:
      return state
  }
}

interface ContactContextType {
  state: ContactState
  dispatch: React.Dispatch<ContactAction>
}

const ContactContext = createContext<ContactContextType | undefined>(undefined)

export function ContactProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(contactReducer, initialState)

  console.log('📊 ContactProvider State:', state)

  return (
    <ContactContext.Provider value={{ state, dispatch }}>
      {children}
    </ContactContext.Provider>
  )
}

export function useContact() {
  const context = useContext(ContactContext)
  if (context === undefined) {
    throw new Error('useContact debe usarse dentro de ContactProvider')
  }
  return context
}