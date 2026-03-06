import { Container, Row, Col } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


function Shop (){
return(
<Container fluid>
    <Row className="d-flex align-items-center" >
        <Col xs={4}></Col>
        <Col xs={4} className="text-center mt-2"> <h1>KIT GARA</h1></Col>
   
 
    <Col xs={4} className="text-end mt-2"><i className="bi bi-search mx-2 fs-5"></i>
    <i className="bi bi-bag mx-2 fs-5"></i>
    </Col>
</Row>
    <Row className="mt-3 mt-lg-5" >
        <Col  xs={12} md={6} lg={3} className="d-flex justify-content-center mb-4">
         <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
        </Col  >
        <Col xs={12} md={6} lg={3}className="d-flex justify-content-center mb-4">
         <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
        </Col>
        <Col xs={12} md={6} lg={3} className="d-flex justify-content-center mb-4">
         <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
        </Col>
        <Col xs={12} md={6} lg={3} className="d-flex justify-content-center mb-4">
         <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card></Col>
    </Row>
</Container>
)

/*
<Carousel interval={null}>
  {ticket.map((item) => (
    <Carousel.Item key={item.id}>
      <div className="card-body bg-secondary rounded-4 d-flex flex-column justify-content-center align-items-center mt-5">
        <h5 className="card-title">{item.day}</h5>
        <p className="card-text">{item.date}</p>
        <p className="card-text">{item.opponents}</p>
        <p className="card-text">{item.stadium}</p>
        <button className="btn btn-primary">Acquista</button>
      </div>
    </Carousel.Item>
  ))}
</Carousel>
*/
 }
export default Shop