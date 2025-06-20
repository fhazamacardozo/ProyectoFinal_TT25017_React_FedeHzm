import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Catalogue from './Pages/Catalogue';
import Cart from './Pages/Cart';
import Login from './Pages/Login';
import Admin from './Pages/Admin';
import Header from './Components/Header';
import NavBar from './Components/NavBar';
import Footer from './Components/Footer';
import { ProtectedRoute, AdminRoute } from './Components/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './Context/AuthContext';

function App() {

  return (
    <Router basename="/ProyectoFinal_TT25017_React_FedeHzm/">
      <AuthProvider>
      <div className='d-flex flex-column min-vh-100'>
        <Header/>
        <NavBar />
        <main className="flex-grow-1">
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
            <Route path="/Admin/:name" element={
              <AdminRoute> 
                <Admin/>
              </AdminRoute>
              }
            /> 
          </Routes>
        </main>
        <Footer />
      </div>
      </AuthProvider>
    </Router>
  )
}

export default App
