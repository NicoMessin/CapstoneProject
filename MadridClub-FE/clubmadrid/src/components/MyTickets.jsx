import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import "../css/Tickets.css";

function MyTickets() {
  const [myTickets, setMyTickets] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:3001/carrelloTickets/mieiTickets", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Errore fetching")))
      .then((data) => setMyTickets(data))
      .catch((err) => console.error(err));
  }, []);

  if (myTickets.length === 0) return <p>Non hai ancora biglietti.</p>;

  return (
    <div className="container my-4">
      <h1 className="mb-4 text-center titleTickets">I miei biglietti</h1>

      <div className="row">
        {myTickets.map((ticket) => (
          <div key={ticket.id} className="col-md-4 col-sm-6 mb-3">
            <div className="card cardMyTickets p-3 d-flex align-items-center text-center">
              <h5 className="ticketDay">{ticket.ticket.day}</h5>
              <p className="ticketDate">{new Date(ticket.ticket.date).toLocaleString("it-IT", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}</p>

              <p className="ticketMatch">
                {ticket.ticket.opponents} <br />
                <span className="stadium">{ticket.stadium}</span>
              </p>

              <div className="ticketInfo">
                <p>
                  Nome: {ticket.nome} Cognome: {ticket.cognome}
                </p>
                <p>Data di nascita: {ticket.dataNascita}</p>
                <p>Settore: {ticket.enumSettore}</p>
                <p>
                  Fila: {ticket.enumFila}, Posto: {ticket.enumPosto}
                </p>
              </div>
              <div className="qrBox mt-3">
  <QRCode value={ticket.qrCode} size={90} />
</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyTickets;
