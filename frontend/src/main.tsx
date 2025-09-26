import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
// We are not using the default bootstrap css, but a dark theme from a CDN in index.html
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles.css'
import './styles/theme.css'

const rootEl = document.getElementById('root')!
createRoot(rootEl).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
