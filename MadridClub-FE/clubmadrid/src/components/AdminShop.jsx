import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import "../css/Admin.css";

function AdminShop(){
    const[product, setProduct]= useState([])
    const[form, setForm]= useState({
        name_product: "",
        description: "",
        price: "",
        imageUrl:""
    })
     const [editingId, setEditingId] = useState(null);

    //GET PRODUCT
    const getProducts = ()=>{
        fetch("http://localhost:3001/products")
        .then((res)=>{if(!res.ok) throw new Error("Errore nel recupero dei prodotti")
            return res.json()
        })
        .then((data)=>{setProduct(data)})
        
        .catch((err)=> console.error(err))
    }
    useEffect(() => {
  getProducts()
}, [])

// AGGIUNGI / MODIFICA PRODOTTO
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:3001/products/${editingId}`
      : "http://localhost:3001/products";
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
      getProducts();
      setForm({ name_product: "", description: "", price: "", imageUrl: "" });
      setEditingId(null); // reset form
    })
    .catch(err => console.log(err));
  }

// DELETE PRODOTTO
const deleteProduct = (id) => {
   if (!window.confirm("Sei sicuro di voler eliminare questo prodotto?")) return;
  fetch(`http://localhost:3001/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  })
  .then(() => getProducts())
  .catch(err => console.log(err))
}

 // INIZIA MODIFICA
  const editProduct = (n) => {
    setForm({
      name_product: n.name_product,
      description: n.description,
     price: n.price,
      imageUrl: n.imageUrl
    });
    setEditingId(n.id);
  }

    return (
  <>
    <Navbar  bg="dark" variant="dark" className="mb-4">
      <Container>
        <Navbar.Brand>Edit</Navbar.Brand>
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
            {editingId ? "Modifica Prodotto" : "Aggiungi Prodotto"}
          </Card.Title>

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Control
                  placeholder="Nome prodotto"
                  value={form.name_product}
                  onChange={(e) =>
                    setForm({ ...form, name_product: e.target.value })
                  }
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Control
                  placeholder="Descrizione"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Control
                  placeholder="Image URL"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Control
                  type="number"
                  placeholder="Prezzo"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
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
                      name_product: "",
                      description: "",
                      price: "",
                      imageUrl: "",
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

      {/* LISTA PRODOTTI */}
      <h4 className="mb-3">Lista Prodotti</h4>

      <Row>
        {product.map((n) => (
          <Col md={4} key={n.id} className="mb-4">
            <Card className="h-100 shadow-sm">
              {n.imageUrl && (
                <Card.Img
                  variant="top"
                  src={n.imageUrl}
                  style={{  objectFit: "cover" }}
                />
              )}

              <Card.Body className="d-flex flex-column">
                <Card.Title>{n.name_product}</Card.Title>
                <Card.Text>{n.description}</Card.Text>
                <Card.Text>
                  <strong>{n.price} €</strong>
                </Card.Text>

                {/* BOTTONI IN FONDO */}
                <div className="d-flex justify-content-between mt-auto">
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => editProduct(n)}
                  >
                    Modifica
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteProduct(n.id)}
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
export default AdminShop