import './index.css'
import App from './App.jsx'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './context/ThemeContext.jsx'
createRoot(document.getElementById('root')).render(
  <ThemeProvider><App /></ThemeProvider>
)

