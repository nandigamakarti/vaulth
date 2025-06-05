console.log('main.tsx: Script loaded')

import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

console.log('main.tsx: Imports completed')

const rootElement = document.getElementById('root')
console.log('main.tsx: Root element:', rootElement)

try {
  if (!rootElement) {
    throw new Error('Root element not found')
  }
  
  console.log('main.tsx: Creating root')
  const root = createRoot(rootElement)
  
  console.log('main.tsx: Rendering TestApp')
  root.render(<App />)
  console.log('main.tsx: Render complete')
} catch (error) {
  console.error('Error in main.tsx:', error)
}
