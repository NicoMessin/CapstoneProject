import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useState, useEffect } from "react";

function Shop() {
  const [product, setProduct] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then((res) => {
        if (!res.ok) 
          throw new Error("Errore nel recuper del prodotto");
          return res.json();
        
      })
      .then((data) => {setProduct(data)})
      .catch((err) => {console.error("Errore fetching product:", err)});
  }, []);
  return (
    <Container fluid>
      <Row className="d-flex align-items-center">
        <Col xs={4}></Col>
        <Col xs={4} className="text-center mt-2">
          {" "}
          <h1>KIT GARA</h1>
        </Col>

        <Col xs={4} className="text-end mt-2">
          <i className="bi bi-search mx-2 fs-5"></i>
          <i className="bi bi-bag mx-2 fs-5"></i>
        </Col>
      </Row>
      <Row className="mt-3 mt-lg-5">
        {product.map((item)=>(

        <Col key={item.id}
          xs={12}
          md={6}
          lg={3}
          className="d-flex justify-content-center mb-4"
        >
          <Card style={{ width: "18rem" }}>
            <Card.Img variant="top" src={item.img}/>
            <Card.Body>
              <Card.Title>{item.name_product}</Card.Title>
              <Card.Text>
               {item.description}
              </Card.Text>
              <Card.Text>
               {item.price}
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
        </Col>
        ))}
      </Row>
    </Container>
  );

}
export default Shop;
