import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ProveedorAutenticacion } from './contextos/ContextoAutenticacion'
import App from './App.jsx'
import './index.css'

// Default to dark mode for premium glassmorphism experience
const stored = localStorage.getItem('cmide-tema')
if (stored === 'light') {
  document.documentElement.classList.remove('dark')
} else {
  document.documentElement.classList.add('dark')
  if (!stored) localStorage.setItem('cmide-tema', 'dark')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProveedorAutenticacion>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: '12px',
              background: 'rgba(20,20,28,.85)',
              color: '#ededf0',
              fontSize: '13.5px',
              fontFamily: "'Inter', 'DM Sans', sans-serif",
              padding: '12px 16px',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,.08)',
              boxShadow: '0 16px 40px rgba(0,0,0,.45)',
            },
          }}
        />
      </ProveedorAutenticacion>
    </BrowserRouter>
  </StrictMode>,
)
