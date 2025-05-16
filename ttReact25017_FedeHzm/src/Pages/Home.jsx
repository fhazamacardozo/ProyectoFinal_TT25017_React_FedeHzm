/*This is a Home.jxs file that contains the Home component of the application.
It imports React and Bootstrap components to create a responsive layout.
It uses the 'Container', 'Row', and 'Col' components from 'react-bootstrap' to create a grid layout.
*/
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';    

function Home() {
    return (
        <Container className="mt-4">
            <Row>
                <Col md={12} className="text-center">
                    <h1>Bienvenido a la Página Principal</h1>
                    <p>Esta es la página principal de la aplicación.</p>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col md={4} className="text-center">
                    <Link to="/Catalogue" className="btn btn-primary">Ir al Catálogo</Link>
                </Col>
                <Col md={4} className="text-center">
                    <Link to="/Cart" className="btn btn-primary">Ir al Carrito</Link>
                </Col>
                <Col md={4} className="text-center">
                    <Link to="/Login" className="btn btn-primary">Iniciar Sesión</Link>
                </Col>
            </Row>
        </Container>
    );
}
export default Home;