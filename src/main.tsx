/* Main entry point for the application - renders the root React component */
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './main.css'
import { recarregarUmaVez } from './components/ErrorBoundary'

// Pedaço de página da versão antiga não existe mais depois de uma publicação nova: recarrega
// (uma vez) em vez de deixar a tela branca.
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  recarregarUmaVez()
})

// @skip-protected: Do not remove. Required for React rendering.
createRoot(document.getElementById('root')!).render(<App />)
