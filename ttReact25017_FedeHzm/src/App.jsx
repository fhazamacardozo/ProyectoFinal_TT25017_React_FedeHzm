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
function App() {
  const [cartItems, setCartItems] = useState([]);

  return (
    <Router>
      <div className='d-flex flex-column min-vh-100'>
        <Header user="Pepito" type="Admin"/>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Catalogue" element={<Catalogue cartItems={cartItems} setCartItems={setCartItems}/>} />
          <Route path="/Cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems}/>} />
          {/* <Route path="/Login" element={<Login />} /> */}
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
