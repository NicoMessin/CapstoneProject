import { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

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
      {/* CAROSELLO PRINCIPALE */}
      <Carousel interval={null} className="mt-4">
        {news.slice(0, 3).map((item) => (
          <Carousel.Item key={item.id}>
            <img
              className="d-block w-100"
              src={item.imageUrl}
              alt={item.title}
            />
            <Carousel.Caption>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* CAROSELLO CARD */}
      <Carousel className="carousel-peek">
        {news.map((item) => (
          <Carousel.Item key={item.id}>
            <div className="d-flex justify-content-center py-5 w-100">
              <Card style={{ width: "18rem" }} className="border border-3 rounded">
                <Card.Img variant="top" src={item.imageUrl} />
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <Button variant="primary">Leggi di più</Button>
                </Card.Body>
              </Card>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
}

export default Home;