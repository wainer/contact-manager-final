import { AuthProvider } from './context/AuthContext'
import { ContactProvider } from './context/ContactContext'
import { ToastProvider } from './context/ToastContext'
import ToastContainer from './components/ToastContainer'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <ContactProvider>
            <ToastProvider>
              {children}
              <ToastContainer />
            </ToastProvider>
          </ContactProvider>
        </AuthProvider>
      </body>
    </html>
  )
}