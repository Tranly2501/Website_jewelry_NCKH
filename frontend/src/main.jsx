import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from '../src/App.jsx'
// import Home from './pages/Home.jsx';
import {BrowserRouter} from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <App />
  </BrowserRouter>
)
