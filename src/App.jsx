import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Catalogue from './Pages/Catalogue';
import Cart from './Pages/Cart';
import Login from './Pages/Login';
import Admin from './Pages/Admin';
import Header from './Components/Header';
import NavBar from './Components/NavBar';
import Footer from './Components/Footer';
import ProtectedAdminRoute from './Components/ProtectedAdminRoute';
import ProtectedUserRoute from './Components/ProtectedUserRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <Router basename="/ProyectoFinal_TT25017_React_FedeHzm/">
      <div className='d-flex flex-column min-vh-100'>
        <Header user="Pepito" type="Admin"/>
        <NavBar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Catalogue" element={<Catalogue/>} />
            <Route path="/Cart" element={
              <ProtectedUserRoute> 
                <Cart/>
              </ProtectedUserRoute>
              }
            />
            <Route path="/Login" element={<Login />} /> 
            <Route path="/Admin/:name" element={
              <ProtectedAdminRoute> 
                <Admin/>
              </ProtectedAdminRoute>
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
