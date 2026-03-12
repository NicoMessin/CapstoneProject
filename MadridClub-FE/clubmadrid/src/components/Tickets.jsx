import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Tickets() {
  const [ticket, setTicket] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // fetch tickets
  useEffect(() => {
    fetch("http://localhost:3001/tickets")
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Errore nel recupero del ticket")
      )
      .then((data) => {
        setTicket(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore fetching ticket:", err);
        setLoading(false);
      });
  }, []);

  // fetch carrello per contatore
  const fetchCartCount = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3001/carrelloTickets/mio", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Errore fetching carrello")))
      .then((data) => {
        const totalCount = data.reduce((sum) => sum + 1, 0);
        setCartCount(totalCount);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  // aggiungi al carrello
  const handleCompra = (item) => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3001/carrelloTickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        enumSettore: "FONDO_SUR",
        enumFila: "FILA_1",
        enumPosto: "A",
        ticketId: item.id,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore aggiunta al carrello");
        return res.json();
      })
      .then(() => fetchCartCount())
      .catch((err) => console.error(err));
  };

  if (loading) return <p>Caricamento in corso...</p>;
  if (!loading && ticket.length === 0) return <p>Impossibile caricare i tickets.</p>;

  return (
    <Container fluid className="sfondoTickets">
      <Row className="d-flex align-items-center bg-dark">
        <Col xs={2}></Col>
        <Col xs={8} className="">
          <h1 className="d-flex justify-content-center mt-2 text-white">BIGLIETTI</h1>
        </Col>
        <Col xs={2} className="text-end ">
          <i className="bi bi-search mx-2 fs-5 text-white"></i>
          <span className="position-relative">
            <i
              className="bi bi-ticket-perforated mx-2 fs-5 text-white"
              onClick={() => navigate("/carrelloTickets")}
            ></i>
            {cartCount > 0 && <span className="cartCount">{cartCount}</span>}
          </span>
        </Col>
      </Row>

      <Row>
        {ticket.map((item) => (
          <Col key={item.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <div className="card-body bg-secondary rounded-4 d-flex flex-column justify-content-center align-items-center mt-5">
              <h5 className="card-title">{item.day}</h5>
              <p className="card-text">{item.date}</p>
              <p className="card-text">{item.opponents}</p>
              <p className="card-text">{item.stadium}</p>
              <button className="btn btn-primary" onClick={() => handleCompra(item)}>
                Acquista
              </button>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Tickets;