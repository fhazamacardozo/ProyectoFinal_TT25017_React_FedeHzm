import {Route,Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Catalogue from './Pages/Catalogue';
import Cart from './Pages/Cart';
import Login from './Pages/Login';
import Admin from './Pages/Admin';
import Header from './Components/Header';
import NavBar from './Components/NavBar';
import Footer from './Components/Footer';
import { ProtectedRoute, AdminRoute } from './Components/ProtectedRoute';
import Register from './Pages/Register';
import ProductManager from './Pages/ProductManager';
import { Spinner } from 'react-bootstrap'; 
import { useAuth } from './Context/AuthContext'; 

function App() {
  const { loading } = useAuth(); 

  return (   
      <div className='d-flex flex-column min-vh-100'>
        <Header/>
        <NavBar />
        <main className="flex-grow-1 d-flex justify-content-center align-items-center">
          {loading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" role="status" variant="primary">
                            <span className="visually-hidden">Cargando autenticación...</span>
                        </Spinner>
                        <p className="mt-3 text-muted">Verificando sesión...</p>
                    </div>
                ) : (
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/Catalogue" element={<Catalogue/>} />
                        <Route path="/Cart" element={
                            <ProtectedRoute> 
                                <Cart/>
                            </ProtectedRoute>
                            }
                        />
                        <Route path="/Login" element={<Login />} /> 
                        <Route path="/Register" element={<Register />} /> 
                        <Route path="/Admin/:name" element={
                            <AdminRoute> 
                                <Admin/>
                            </AdminRoute>
                        }/>
                        <Route path="/ProductManager" element={
                            <AdminRoute>
                                <ProductManager/>
                            </AdminRoute>
                        }/> 
                    </Routes>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default App
