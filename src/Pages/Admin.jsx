import AdminActivityMassiveLog from '../Components/admin/AdminActivityMassiveLog';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Card, ListGroup, Spinner, Alert } from "react-bootstrap";
import { FaUserShield, FaCheckCircle, FaUsers, FaChartBar, FaThList, FaBell, FaExclamationCircle, FaUserPlus, FaBoxOpen } from "react-icons/fa";
import { getRecentProductActivities, getRecentUserActivities } from "../Services/AdminActivityService";

function Admin() {
    const { name } = useParams();
    const [productActivities, setProductActivities] = useState([]);
    const [userActivities, setUserActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchActivities() {
            setLoading(true);
            setError(null);
            try {
                const [products, users] = await Promise.all([
                    getRecentProductActivities(5),
                    getRecentUserActivities(5)
                ]);
                setProductActivities(products);
                setUserActivities(users);
            } catch (err) {
                setError("No se pudieron cargar las actividades recientes.",err);
            } finally {
                setLoading(false);
            }
        }
        fetchActivities();
    }, []);

    return (
        <Container className="py-4 d-flex flex-column align-items-center">
            <Card className="shadow-lg p-4 mb-4 w-100" style={{ maxWidth: 600 }}>
                <div className="text-center mb-3">
                    <FaUserShield size={48} className="text-primary mb-2" />
                    <h1 className="fw-bold text-primary">¡Bienvenido al Panel de Administración!</h1>
                    <p className="lead text-secondary">
                        Hola <span className="fw-bold text-dark">{name}</span> 👋<br/>
                        Aquí puedes controlar el poder de la tienda, gestionar productos y usuarios, y ver todo lo que ocurre en tu e-commerce.
                    </p>
                </div>

                {/* Actividad reciente */}
                <div className="mb-4">
                    <h4 className="mb-3 d-flex align-items-center gap-2">
                        <FaExclamationCircle className="text-warning" /> Actividad reciente
                    </h4>
                    {loading ? (
                        <div className="text-center"><Spinner animation="border" size="sm" className="me-2" />Cargando...</div>
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : (
                        <>
                        <ListGroup className="mb-3">
                            <ListGroup.Item variant="info" className="fw-bold"><FaBoxOpen className="me-2 text-primary" />Productos agregados</ListGroup.Item>
                            {productActivities.length === 0 ? (
                                <ListGroup.Item>No hay productos agregados recientemente.</ListGroup.Item>
                            ) : productActivities.map(act => (
                                act.action === 'add-massive' ? (
                                    <AdminActivityMassiveLog key={act.id} activity={act} />
                                ) : (
                                    <ListGroup.Item key={act.id}>
                                        <span className="fw-bold">{act.productName}</span> agregado por <span className="text-primary">{act.userName}</span> <span className="text-muted">({act.userId})</span>
                                        <span className={"badge ms-2 " + (act.source === "json" ? "bg-info text-dark" : "bg-secondary")}>{act.source === "json" ? "Carga masiva (JSON)" : "Carga manual"}</span>
                                        <br/>
                                        <span className="text-secondary small">{act.timestamp && new Date(act.timestamp.seconds * 1000).toLocaleString()}</span>
                                    </ListGroup.Item>
                                )
                            ))}
                        </ListGroup>
                        <ListGroup>
                            <ListGroup.Item variant="info" className="fw-bold"><FaUserPlus className="me-2 text-success" />Usuarios nuevos</ListGroup.Item>
                            {userActivities.length === 0 ? (
                                <ListGroup.Item>No hay usuarios registrados recientemente.</ListGroup.Item>
                            ) : userActivities.map(act => (
                                <ListGroup.Item key={act.id}>
                                    <span className="fw-bold">{act.userName}</span> (<span className="text-primary">{act.email}</span>)<br/>
                                    <span className="text-secondary small">{act.timestamp && new Date(act.timestamp.seconds * 1000).toLocaleString()}</span>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        </>
                    )}
                </div>

                <ul className="list-unstyled fs-5">
                    <li className="mb-3 d-flex align-items-center gap-2">
                        <FaCheckCircle className="text-success" /> <span>Agregar, editar y eliminar productos</span>
                    </li>
                    <li className="mb-3 d-flex align-items-center gap-2">
                        <FaUsers className="text-info" /> <span>Gestionar usuarios y permisos</span>
                    </li>
                    <li className="mb-3 d-flex align-items-center gap-2">
                        <FaChartBar className="text-warning" /> <span>Ver estadísticas y reportes</span>
                    </li>
                    <li className="mb-3 d-flex align-items-center gap-2">
                        <FaThList className="text-primary" /> <span>Acceder al gestor de productos</span>
                    </li>
                    <li className="mb-3 d-flex align-items-center gap-2">
                        <FaBell className="text-danger" /> <span>Recibir alertas y notificaciones importantes</span>
                    </li>
                </ul>
                <div className="text-center mt-4">
                    <span className="badge bg-success fs-6 px-3 py-2">¡Tienes el control total! 🚀</span>
                </div>
            </Card>
        </Container>
    );
}
export default Admin;