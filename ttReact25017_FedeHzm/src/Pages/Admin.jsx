//Admin.jsx 
// This component is used to display the admin page. It shows the user name retrieved from params

import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";

function Admin() {
    const { name } = useParams();
    return (
        <Container className="py-4">
            <h1 className="text-center">Admin Page</h1>
            <p className="text-center">Welcome, {name}</p>
        </Container>
    );
}
export default Admin;