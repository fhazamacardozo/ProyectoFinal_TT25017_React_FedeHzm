import React from 'react';
import { Accordion, Card } from 'react-bootstrap';

function AdminActivityMassiveLog({ activity }) {
  // activity.products es un array [{ id, title }]
    return (
        <Card className="mb-3">
        <Card.Body>
            <Card.Title>
            <span className="badge bg-info me-2">Carga masiva</span>
            {activity.userName} ({activity.userId})
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
            {activity.timestamp?.seconds
                ? new Date(activity.timestamp.seconds * 1000).toLocaleString()
                : 'Sin fecha'}
            </Card.Subtitle>
            <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                Productos subidos ({activity.products?.length || 0})
                </Accordion.Header>
                <Accordion.Body>
                <ul>
                    {activity.products?.map(prod => (
                    <li key={prod.id}>{prod.title}</li>
                    ))}
                </ul>
                </Accordion.Body>
            </Accordion.Item>
            </Accordion>
        </Card.Body>
        </Card>
    );
}

export default AdminActivityMassiveLog;
