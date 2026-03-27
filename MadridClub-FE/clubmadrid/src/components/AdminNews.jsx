import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Card, Form, Row, Col, Button, Alert } from "react-bootstrap";
import "../css/Admin.css";

function AdminNews() {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    publishedAt: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [erroreCampi, setErroreCampi] = useState(""); // nuovo stato per errori

  // GET NEWS
  const getNews = () => {
    fetch("http://localhost:3001/news")
      .then((res) => res.json())
      .then((data) => setNews(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getNews();
  }, []);

  // AGGIUNGI / MODIFICA NEWS
  const handleSubmit = (e) => {
    e.preventDefault();

    // controllo campi obbligatori
    if (!form.title.trim() || !form.description.trim() || !form.publishedAt) {
      setErroreCampi("Tutti i campi obbligatori devono essere compilati!");
      return;
    }

    setErroreCampi(""); // reset errore

    const url = editingId
      ? `http://localhost:3001/news/${editingId}`
      : "http://localhost:3001/news";
    const method = editingId ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((updatedItem) => {
        if (editingId) {
          setNews(news.map((n) => (n.id === editingId ? updatedItem : n)));
        } else {
          setNews([...news, updatedItem]);
        }
        setForm({ title: "", description: "", imageUrl: "", publishedAt: "" });
        setEditingId(null);
      })
      .catch((err) => console.log(err));
  };

  // DELETE NEWS
  const deleteNews = (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa news?")) return;
    fetch(`http://localhost:3001/news/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(() => getNews())
      .catch((err) => console.log(err));
  };

  // INIZIA MODIFICA
  const editNews = (n) => {
    setForm({
      title: n.title,
      description: n.description,
      imageUrl: n.imageUrl,
      publishedAt: n.publishedAt,
    });
    setEditingId(n.id);
    setErroreCampi(""); // reset errore quando si inizia modifica
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand href="#home">Edit</Navbar.Brand>
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
        <Card className="mb-4 shadow">
          <Card.Body>
            <Card.Title>{editingId ? "Modifica News" : "Aggiungi News"}</Card.Title>

            {erroreCampi && <Alert variant="danger">{erroreCampi}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col>
                  <Form.Control
                    placeholder="Titolo"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Control
                    placeholder="Descrizione"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Control
                    placeholder="Image URL"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Control
                    type="datetime-local"
                    value={form.publishedAt}
                    onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                    required
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
                      setForm({ title: "", description: "", imageUrl: "", publishedAt: "" });
                      setEditingId(null);
                      setErroreCampi("");
                    }}
                  >
                    Annulla
                  </Button>
                )}
              </div>
            </Form>
          </Card.Body>
        </Card>

        <h4 className="mb-3">Lista News</h4>

        <Row>
          {news.map((n) => (
            <Col sm={6} md={4} key={n.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                {n.imageUrl && (
                  <Card.Img
                    variant="top"
                    src={n.imageUrl}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{n.title}</Card.Title>
                  <Card.Text>{n.description}</Card.Text>
                  <Card.Text className="text-secondary">
                    {new Date(n.publishedAt).toLocaleString("it-IT", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Card.Text>

                  <div className="d-flex justify-content-between mt-auto">
                    <Button size="sm" variant="warning" onClick={() => editNews(n)}>
                      Modifica
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => deleteNews(n.id)}>
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

export default AdminNews;


