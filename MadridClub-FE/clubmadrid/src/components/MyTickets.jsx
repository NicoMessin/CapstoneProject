import { useEffect, useState } from "react";

function MyTickets() {
  const [myTickets, setMyTickets] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
   fetch("http://localhost:3001/carrelloTickets/mieiTickets", {
  headers: { Authorization: `Bearer ${token}` },
})
      .then(res => res.ok ? res.json() : Promise.reject("Errore fetching"))
      .then(data => setMyTickets(data))
      .catch(err => console.error(err));
  }, []);

  if (myTickets.length === 0) return <p>Non hai ancora biglietti.</p>;

  return (
    <div className="container my-4">
      <h1>I miei biglietti</h1>
      <div className="row">
        {myTickets.map(ticket => (
          <div key={ticket.id} className="col-md-4 mb-3">
            <div className="card p-3">
              <h5>{ticket.day} - {ticket.date}</h5>
              <p>{ticket.opponents} @ {ticket.stadium}</p>
              <p>Settore: {ticket.enumSettore}, Fila: {ticket.enumFila}, Posto: {ticket.enumPosto}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyTickets;