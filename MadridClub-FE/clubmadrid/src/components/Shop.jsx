import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Shop() {
  const [product, setProduct] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // fetch prodotti
  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Errore fetching prodotti"),
      )
      .then((data) => setProduct(data))
      .catch((err) => console.error(err));
  }, []);

  // fetch carrello per contatore
  const fetchCartCount = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/carrelloItemsShop/mio", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Errore fetching carrello"),
      )
      .then((data) => {
        const totalCount = data.reduce((sum, item) => sum + item.quantita, 0);
        setCartCount(totalCount);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  // aggiungi prodotto al carrello
  const handleCompra = (item) => {
    const token = localStorage.getItem("token");

    // Se non sei loggato, reindirizza al login
  if (!token) {
     alert("Per acquistare un prodotto è necessario fare prima il login.");
    navigate("/auth/Login");
    return;
  }

    fetch("http://localhost:3001/carrelloItemsShop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        quantita: 1,
        enumTaglia: "M",
        prodottoId: item.id,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore aggiunta al carrello");
        return res.json();
      })
      .then(() => fetchCartCount())
      .catch((err) => console.error(err));
  };

  return (
    <Container fluid>
      <Row className="d-flex align-items-center">
        <Col xs={4}></Col>

        <Col xs={4} className="text-center mt-2">
          <h1>KIT GARA</h1>
        </Col>

        <Col xs={4} className="text-end mt-2">
          <i className="bi bi-search mx-2 fs-5"></i>

          <span className="position-relative">
            <i
              className="bi bi-bag mx-2 fs-5"
              onClick={() => navigate("/carrelloItemsShop")}
            ></i>

            {cartCount > 0 && <span className="cartCount">{cartCount}</span>}
          </span>
        </Col>
      </Row>

      <Row className="mt-3 mt-lg-5">
        {product.map((item) => (
          <Col
            key={item.id}
            xs={12}
            md={6}
            lg={3}
            className="d-flex justify-content-center mb-4"
          >
            <Card style={{ width: "18rem" }}>
              <Card.Img variant="top" src={item.imageUrl} />

              <Card.Body>
                <Card.Title>{item.name_product}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <Card.Text>€{item.price}</Card.Text>

                <Button variant="primary" onClick={() => handleCompra(item)}>
                  COMPRA
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Shop;
