import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Tickets() {
  const [ticket, setTicket] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // fetch tickets
  useEffect(() => {
    fetch("http://localhost:3001/tickets")
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Errore nel recupero del ticket"),
      )
      .then((data) => setTicket(data))
      .catch((err) => console.error("Errore fetching ticket:", err));
  }, []);

  // fetch carrello count
  const fetchCartCount = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/carrelloTickets/mio", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Errore fetching carrello"),
      )
      .then((data) => {
        const soloCarrello = data.filter((item) => item.acquistato !== true);
        setCartCount(soloCarrello.length);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  // acquisto
  const handleCompra = (item) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Per acqiistare un ticket è necessario effettuare il login");
      navigate("/auth/Login");
      return;
    }

    fetch("http://localhost:3001/carrelloTickets/mio", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore fetching carrello");
        return res.json();
      })
      .then((carrello) => {
        // conteggio totale (carrello + acquistati)
        const count = carrello.filter((i) => i.ticket.id === item.id).length;

        if (count >= 5) {
          alert("Non puoi avere più di 5 biglietti per questa partita.");
          throw new Error("Limite raggiunto");
        }

        return fetch(
          `http://localhost:3001/carrelloTickets/postiDisponibili/${item.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      })
      .then((res) => {
        if (!res.ok) throw new Error("Errore posti disponibili");
        return res.json();
      })
      .then((posti) => {
        const file = Object.keys(posti);
        if (file.length === 0) throw new Error("Nessuna fila disponibile");

        const filaRandom = file[Math.floor(Math.random() * file.length)];
        const postiFila = posti[filaRandom];

        if (!postiFila || postiFila.length === 0) {
          throw new Error("Nessun posto disponibile");
        }

        const postoRandom =
          postiFila[Math.floor(Math.random() * postiFila.length)];

        return fetch("http://localhost:3001/carrelloTickets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ticketId: item.id,
            enumSettore: "FONDO_SUR",
            enumFila: filaRandom,
            enumPosto: postoRandom,
            nome: "",
            cognome: "",
            dataNascita: "2000-01-01",
          }),
        });
      })
      .then((res) => {
        if (!res.ok) throw new Error("Errore aggiunta al carrello");
        return res.json();
      })
      .then(() => fetchCartCount())
      .catch((err) => console.error(err));
  };

  if (ticket.length === 0) return <p>Nessun ticket disponibile.</p>;

  return (
    <Container fluid className="sfondoTickets">
      <Row className="d-flex align-items-center bg-dark py-2">
        <Col xs={2}></Col>
        <Col xs={8}>
          <h1 className="d-flex justify-content-center mt-2 text-white">
            BIGLIETTI
          </h1>
        </Col>
        <Col xs={2} className="text-end">
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

      <Row className="p-4">
        {ticket.map((item) => (
          <Col key={item.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <div className="ticket-card h-100 d-flex flex-column justify-content-between">
              <div>
                <h5 className="ticket-title">{item.day}</h5>
                <p className="ticket-text">
                  {new Date(item.date).toLocaleString("it-IT", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="ticket-text">{item.opponents}</p>
                <p className="ticket-text">{item.stadium}</p>
              </div>

              <button
                className="btn btn-primary w-100 mt-3"
                onClick={() => handleCompra(item)}
              >
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
