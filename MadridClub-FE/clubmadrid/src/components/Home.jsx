import { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";
import { Container, Row, Col } from "react-bootstrap";
function Home() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/news") // il tuo backend REST
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel recupero delle news");
        return res.json();
      })
      .then((data) => setNews(data))
      .catch((err) => console.error("Errore fetching news:", err));
  }, []);

  if (news.length === 0) {
    return <p>Impossibile caricare le news.</p>;
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col sm={6}>
            {/* CAROSELLI PRINCIPALI */}
            <Carousel
              interval={5000}
              controls={false}
              className="mt-4  "
            >
              {news.slice(0, 3).map((item) => (
                <Carousel.Item key={item.id}>
                  <img
                    className="d-block w-100  rounded-5 carouselImg"
                    src={item.imageUrl}
                    alt={item.title}
              
                  />
                  <Carousel.Caption className="sfondoChiaro">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
          <Col sm={6}>
            <Carousel interval={5000} controls={false} className="mt-4 d-none d-sm-block">
              {news.slice(4, 7).map((item) => (
                <Carousel.Item key={item.id}>
                  <img
                    className="d-block w-100 rounded-5 carouselImg"
                    src={item.imageUrl}
                    alt={item.title}
                    
                  />
                  <Carousel.Caption className="sfondoChiaro">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>

        {/* CAROSELLI CARD */}
        <Row>
          <Col xs={6} sm={4} md={3}>
            <Carousel
              interval={6000}
              controls={false}
              indicators={false}
              className="carousel-peek "
            >
              {news.slice(8, 10).map((item) => (
                <Carousel.Item key={item.id}>
                  <div className="d-flex justify-content-center py-5 w-100">
                    <Card style={{ width: "18rem" }} className=" rounded-4">
                      <Card.Img
                        variant="top"
                        src={item.imageUrl}
                        className="rounded-top-4"
                      />
                      <Card.Body className="overflow-hidden">
                        <Card.Title>{item.title}</Card.Title>
                        <Card.Text>{item.description}</Card.Text>
                      </Card.Body>
                    </Card>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
          <Col xs={6} md={3} sm={4}>
            <Carousel
              interval={6000}
              controls={false}
              indicators={false}
              className="carousel-peek "
            >
              {news.slice(11, 13).map((item) => (
                <Carousel.Item key={item.id}>
                  <div className="d-flex justify-content-center py-5 w-100">
                    <Card style={{ width: "18rem" }} className="rounded-4">
                      <Card.Img
                        variant="top"
                        src={item.imageUrl}
                        className="rounded-top-4"
                      />
                      <Card.Body className="overflow-hidden">
                        <Card.Title>{item.title}</Card.Title>
                        <Card.Text>{item.description}</Card.Text>
                      </Card.Body>
                    </Card>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
          <Col md={3} sm={4}>
            <Carousel
              interval={6000}
              controls={false}
              indicators={false}
              className="carousel-peek d-none d-sm-block"
            >
              {news.slice(14, 16).map((item) => (
                <Carousel.Item key={item.id}>
                  <div className="d-flex justify-content-center py-5 w-100">
                    <Card style={{ width: "18rem" }} className=" rounded-4">
                      <Card.Img
                        variant="top"
                        src={item.imageUrl}
                        className="rounded-top-4"
                      />
                      <Card.Body className="overflow-hidden">
                        <Card.Title>{item.title}</Card.Title>
                        <Card.Text>{item.description}</Card.Text>
                      </Card.Body>
                    </Card>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
          <Col md={3}>
            <Carousel
              interval={6000}
              controls={false}
              indicators={false}
              className="carousel-peek d-none d-md-block"
            >
              {news.slice(17, 19).map((item) => (
                <Carousel.Item key={item.id}>
                  <div className="d-flex justify-content-center py-5 w-100">
                    <Card style={{ width: "18rem" }} className="rounded-4">
                      <Card.Img
                        variant="top"
                        src={item.imageUrl}
                        className="rounded-top-4"
                      />
                      <Card.Body className="overflow-hidden">
                        <Card.Title>{item.title}</Card.Title>
                        <Card.Text>{item.description}</Card.Text>
                      </Card.Body>
                    </Card>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Home;
