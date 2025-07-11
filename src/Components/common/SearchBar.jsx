import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa'; 

function SearchBar({ searchTerm, onSearchChange, onSearchSubmit }) {
    const handleSubmit = (e) => {
        e.preventDefault(); 
        onSearchSubmit();
    };

    return (
        <Form className="mb-4" onSubmit={handleSubmit}>
            <InputGroup>
                <FormControl
                    placeholder="Buscar productos..."
                    aria-label="Buscar productos"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                <Button variant="primary" type='submit'>
                    <FaSearch className="me-2" /> Buscar
                </Button>
            </InputGroup>
        </Form>
    );
}

export default SearchBar;