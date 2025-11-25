import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'next-themes';
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute={"class"}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>,
)
