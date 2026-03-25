import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
function AdminPartite() {
  const [match, setMatch] = useState([]);
  const [form, setForm] = useState({
    casa: "",
    trasferta: "",
    data: "",
  });
  const [editingId, setEditingId] = useState(null);

  // GET MATCH
  const getPartite = () => {
    fetch("http://localhost:3001/partite")
      .then((res) => res.json())
      .then((data) => setMatch(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getPartite();
  }, []);

  // AGGIUNGI / MODIFICA NEWS
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:3001/partite/${editingId}`
      : "http://localhost:3001/partite";
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
      getPartite();
      setForm({ casa: "", trasferta: "", data: ""});
      setEditingId(null); // reset form
    })
    .catch(err => console.log(err));
  }

  // DELETE MATCH
  const deleteMatch = (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa partita?")) return;
    fetch(`http://localhost:3001/partite/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(() => getPartite())
      .catch((err) => console.log(err));
  };

  // INIZIA MODIFICA
  const editTicket = (n) => {
    setForm({
      casa: n.casa,
      trasfera: n.trasfera,
      data: n.data,
     
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
            {editingId ? "Modifica Partita" : "Aggiungi Partita"}
          </Card.Title>

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Squadra di casa"
                  value={form.casa}
                  onChange={(e) =>
                    setForm({ ...form, casa: e.target.value })
                  }
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Squadra trasferta"
                  value={form.trasferta}
                  onChange={(e) =>
                    setForm({ ...form, trasferta: e.target.value })
                  }
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Control
                  type="date"
                  value={form.data}
                  onChange={(e) =>
                    setForm({ ...form, data: e.target.value })
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
                    setForm({ casa: "", trasferta: "", data: "" });
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
      <h4 className="mb-3">Lista Partite</h4>

      <Row>
        {match.map((n) => (
          <Col md={4} key={n.id} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-center">
                  {n.casa} VS {n.trasferta}
                </Card.Title>

                <Card.Text className="text-center text-secondary">{n.data}</Card.Text>

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
                    onClick={() => deleteMatch(n.id)}
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
export default AdminPartite;
