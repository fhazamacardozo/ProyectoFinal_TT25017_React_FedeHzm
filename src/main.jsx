import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext.jsx';
import { CartProvider } from './Context/CartContext.jsx';
import {HeadProvider} from 'react-head';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeadProvider>
      <Router basename="/ProyectoFinal_TT25017_React_FedeHzm/">
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </Router>
    </HeadProvider>
  </StrictMode>,
)
