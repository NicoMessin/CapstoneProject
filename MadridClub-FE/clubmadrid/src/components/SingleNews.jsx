import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

function SingleNews() {
  const { id } = useParams();
  const [news, setNews] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/news/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel recupero della news");
        return res.json();
      })
      .then((data) => setNews(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!news) return <p className="text-center mt-5">Loading...</p>;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
            
            <Card.Img
              variant="top"
              src={news.imageUrl}
              alt="img news"
              
            />

            <Card.Body className="p-4">
              <Card.Title className="fs-3 fw-bold mb-3">
                {news.title}
              </Card.Title>

              <Card.Text className="text-muted mb-3">
                {new Date(news.publishedAt).toLocaleString("it-IT", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </Card.Text>

              <Card.Text className="fs-5">
                {news.description}
              </Card.Text>
            </Card.Body>

          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SingleNews;