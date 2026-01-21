import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import HISContextData from './modules/his-utils/contextApi/HISContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import './Sass/main.scss';
import store from './modules/his-utils/App/store.jsx'
import { Provider } from 'react-redux'
import { SQLEditorProvider } from './modules/his-utils/Contexts/SQLEditorContext.jsx'
import { LoaderProvider } from './modules/his-utils/Contexts/LoaderContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/db">
      <HISContextData>

        <SQLEditorProvider>
          <LoaderProvider>
            <Provider store={store}>
              <App />
            </Provider>
          </LoaderProvider>
        </SQLEditorProvider>
      </HISContextData>
    </BrowserRouter>
  </StrictMode>
)
