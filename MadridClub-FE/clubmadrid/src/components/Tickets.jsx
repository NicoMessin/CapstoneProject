import { Container, Row, Col } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";

function Tickets() {
  return (
    <Container fluid>
      <Row className="d-flex align-items-center">
        <Col xs={4}></Col>
        <Col xs={4} className=" mt-2 d-flex justify-content-center">
          
          <h1>BIGLIETTI</h1>
        </Col>

        <Col xs={4} className="text-end mt-2">
          <i className="bi bi-search mx-2 fs-5 "></i>
          <i className="bi bi-ticket-perforated mx-2 fs-5"></i>
        </Col>
      </Row>
<Row>

      <Carousel >
  <Carousel.Item>
    <div className="card text-center mx-auto w-100 " >
      <div className="card-body bg-danger ">
        <h5 className="card-title">Partita 1</h5>
        <p className="card-text">12/03/2026 - 20:45</p>
        <p className="card-text">Real Madrid vs Barcellona</p>
        <button className="btn btn-primary">Acquista</button>
      </div>
    </div>
  </Carousel.Item>

  <Carousel.Item>
    <div className="card text-center mx-auto w-100">
      <div className="card-body bg-danger">
        <h5 className="card-title">Partita 2</h5>
        <p className="card-text">13/03/2026 - 18:30</p>
        <p className="card-text">Juventus vs Milan</p>
        <button className="btn btn-primary">Acquista</button>
      </div>
    </div>
  </Carousel.Item>

  <Carousel.Item>
    <div className="card text-center mx-auto w-100" >
      <div className="card-body bg-danger">
        <h5 className="card-title">Partita 3</h5>
        <p className="card-text">14/03/2026 - 21:00</p>
        <p className="card-text">Inter vs Napoli</p>
        <button className="btn btn-primary">Acquista</button>
      </div>
    </div>
  </Carousel.Item>

  <Carousel.Item>
    <div className="card text-center mx-auto w-100" >
      <div className="card-body bg-danger">
        <h5 className="card-title">Partita 4</h5>
        <p className="card-text">15/03/2026 - 19:00</p>
        <p className="card-text">Atalanta vs Roma</p>
        <button className="btn btn-primary">Acquista</button>
      </div>
    </div>
  </Carousel.Item>
</Carousel>
</Row>
    </Container>
  );
}
export default Tickets;
