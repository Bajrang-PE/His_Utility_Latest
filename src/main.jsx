import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import HISContextData from './modules/his-utils/contextApi/HISContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import './Sass/main.scss';
import store from './modules/his-utils/App/store.jsx'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <HISContextData>
        <Provider store={store}>
          <App />
        </Provider>
      </HISContextData>
    </BrowserRouter>
  </StrictMode>
)
