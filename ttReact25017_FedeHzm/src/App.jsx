import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';  
import Home from './Pages/Home';
import Catalogue from './Pages/Catalogue';
import Cart from './Pages/Cart';
import Header from './Components/Header';
import NavBar from './Components/NavBar';
import Footer from './Components/Footer';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import { useState } from 'react';
import ProtectedRoute from './Components/ProtectedRoute';
import Login from './Pages/Login';
import Admin from './Pages/Admin';
function App() {
  const [cartItems, setCartItems] = useState([]);

  return (
    <Router>
      <div className='d-flex flex-column min-vh-100'>
        <Header user="Pepito" type="Admin"/>
        <NavBar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Catalogue" element={<Catalogue cartItems={cartItems} setCartItems={setCartItems}/>} />
            <Route path="/Cart" element={
              <ProtectedRoute isAuthenticated> 
                <Cart cartItems={cartItems} setCartItems={setCartItems}/>
              </ProtectedRoute>
              }
            />
            <Route path="/Login" element={<Login />} /> 
            <Route path="/Admin/:name" element={
              <ProtectedRoute > 
                <Admin/>
              </ProtectedRoute>
              }
            /> 
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
