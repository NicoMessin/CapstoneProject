import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Card, Form, Row, Col, Button } from "react-bootstrap";


function AdminTickets(){

const [tickets, setTickets] = useState([])

const [form, setForm] = useState({
  day: "",
  date: "",
  opponents: "",
  stadium: "",
  price: ""
})
const [editingId, setEditingId] = useState(null);

// GET TICKETS
const getTickets = () => {
  fetch("http://localhost:3001/tickets")
    .then(res => res.json())
    .then((data) => {
  const sorted = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  setTickets(sorted);
})
    .catch(err => console.log(err))
}

useEffect(() => {
  getTickets()
}, [])

 // AGGIUNGI / MODIFICA TICKET
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:3001/tickets/${editingId}`
      : "http://localhost:3001/tickets";
    const method = editingId ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify(form)
    })
    .then(() => {
      getTickets();
      setForm({ day: "", date: "", opponents: "", stadium: "", price: "" });
      setEditingId(null); // reset form
    })
    .catch(err => console.log(err));
  }

// DELETE TICKET
const deleteTicket = (id) => {
   if (!window.confirm("Sei sicuro di voler eliminare questo ticket?")) return;
  fetch(`http://localhost:3001/tickets/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  })
  .then(() => getTickets())
  .catch(err => console.log(err))
}
// INIZIA MODIFICA
  const editTicket = (n) => {
    setForm({
      day: n.day,
      date: n.date,
      opponents: n.opponents,
      stadium: n.stadium,
      price: n.price
    });
    setEditingId(n.id);
  }

return (
  <>
    <Navbar expand="lg" bg="dark" variant="dark" className="mb-4">
      <Container>
        <Navbar.Brand>Admin Panel</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link href="/adminNews">News</Nav.Link>
            <Nav.Link href="/adminShop">Shop</Nav.Link>
            <Nav.Link href="/adminTickets">Tickets</Nav.Link>
            <Nav.Link href="/adminPartite">Partite</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <Container>
      {/* FORM */}
      <Card className="mb-4 shadow">
        <Card.Body>
          <Card.Title>
            {editingId ? "Modifica Ticket" : "Aggiungi Ticket"}
          </Card.Title>

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Control
                  placeholder="Giornata"
                  value={form.day}
                  onChange={(e) =>
                    setForm({ ...form, day: e.target.value })
                  }
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Control
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Control
                  placeholder="Avversari"
                  value={form.opponents}
                  onChange={(e) =>
                    setForm({ ...form, opponents: e.target.value })
                  }
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Control
                  placeholder="Stadio"
                  value={form.stadium}
                  onChange={(e) =>
                    setForm({ ...form, stadium: e.target.value })
                  }
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Control
                  type="number"
                  step="0.01"
                  placeholder="Prezzo"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                />
              </Col>
            </Row>

            <div className="d-flex gap-2">
              <Button type="submit" variant="primary">
                {editingId ? "Salva" : "Aggiungi"}
              </Button>

              {editingId && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setForm({
                      day: "",
                      date: "",
                      opponents: "",
                      stadium: "",
                      price: "",
                    });
                    setEditingId(null);
                  }}
                >
                  Annulla
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* LISTA */}
      <h4 className="mb-3">Lista Tickets</h4>

      <Row>
        {tickets.map((n) => (
          <Col md={4} sm={6} key={n.id} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column justify-content-center">
                <Card.Title className="text-center">
                  {n.day}  
                  <Card.Text className="text-secondary mt-2"> {new Date(n.date).toLocaleString("it-IT", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}</Card.Text>
                </Card.Title>

                <Card.Text className="text-center">{n.opponents}</Card.Text>
                <Card.Text className="text-center mb-4">{n.stadium}</Card.Text>
               

                {/* BOTTONI IN FONDO */}
                <div className="d-flex justify-content-between mt-auto">
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => editTicket(n)}
                  >
                    Modifica
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteTicket(n.id)}
                  >
                    Elimina
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  </>
);
}

export default AdminTickets