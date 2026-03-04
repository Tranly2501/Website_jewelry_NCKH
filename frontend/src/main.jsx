import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from '../src/App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { CartProvider } from './util/CartContenxt.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <CartProvider>
  <BrowserRouter>
  <App />
  </BrowserRouter>
  </CartProvider>
)
