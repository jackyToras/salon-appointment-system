import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initKeycloak } from './services/keycloakService'

const root = createRoot(document.getElementById('root')!)

// Show loading
root.render(
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '1.5rem',
    flexDirection: 'column',
    gap: '20px'
  }}>
    <div>Initializing...</div>
  </div>
)

// Initialize Keycloak with timeout
const initTimeout = setTimeout(() => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}, 3000)

initKeycloak(() => {
  clearTimeout(initTimeout)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}).catch((error) => {
  clearTimeout(initTimeout)
  console.error('❌ Keycloak failed:', error)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
})