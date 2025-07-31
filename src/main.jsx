import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import HISContextData from './modules/his-utils/contextApi/HISContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HISContextData>
        <App />
    </HISContextData>
  </StrictMode>
)
