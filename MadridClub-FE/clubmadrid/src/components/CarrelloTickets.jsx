import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function CarrelloTickets() {
  const [itemCarrello, setItemCarrello] = useState([]);
  const [postiDisponibili, setPostiDisponibili] = useState({});
  const token = localStorage.getItem("token");

  const prezziSettore = {
    LATERAL_ESTE: 60,
    LATERAL_OESTE: 60,
    FONDO_SUR: 40,
    FONDO_NORTE: 40,
    VIP_BOXES: 200,
    ZONA_PRENSA: 80,
    PISTA: 150,
    PMR: 250,
    APMR: 250,
  };

  const fetchCarrello = () => {
    if (!token) return console.error("Token mancante!");
    fetch("http://localhost:3001/carrelloTickets/mio", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) return res.text().then((t) => Promise.reject(`Errore fetching carrello: ${res.status} ${t}`));
        return res.json();
      })
      .then((data) => {
        setItemCarrello(data);
        data.forEach((item) => fetchPostiDisponibili(item.ticket.id));
      })
      .catch((err) => console.error(err));
  };

  const fetchPostiDisponibili = (ticketId) => {
    fetch(`http://localhost:3001/carrelloTickets/postiDisponibili/${ticketId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) return Promise.reject(`Errore fetching posti disponibili: ${res.status}`);
        return res.json();
      })
      .then((data) => setPostiDisponibili((prev) => ({ ...prev, [ticketId]: data })))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCarrello();
  }, []);

  const aggiornaItem = (id, enumSettore, enumFila, enumPosto) => {
    fetch(
      `http://localhost:3001/carrelloTickets/${id}?enumSettore=${enumSettore}&enumFila=${enumFila}&enumPosto=${enumPosto}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Errore aggiornamento ticket");
        fetchCarrello();
      })
      .catch((err) => console.error(err));
  };

  const eliminaTicket = (id) => {
    fetch(`http://localhost:3001/carrelloTickets/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore eliminazione ticket");
        fetchCarrello();
      })
      .catch((err) => console.error(err));
  };

  const svuotaCarrello = () => {
    fetch("http://localhost:3001/carrelloTickets/mio", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore svuotamento carrello");
        fetchCarrello();
      })
      .catch((err) => console.error(err));
  };

  const aggiornaInfo = (id, campo) => {
    fetch(`http://localhost:3001/carrelloTickets/updateInfo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(campo),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore aggiornamento info ticket");
        fetchCarrello();
      })
      .catch((err) => console.error(err));
  };

//STRIPE
const paga = () => {

  const items = itemCarrello.map(item => ({
    settore: item.enumSettore,
    price: prezziSettore[item.enumSettore],
    quantity: 1,
    partita: item.ticket.opponents
  }));

  fetch("http://localhost:3001/stripe/checkout-tickets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(items)
  })
  .then(res => {
    if (!res.ok) throw new Error("Errore pagamento");
    return res.json();
  })
  .then(data => {
    window.location.href = data.url;
  })
  .catch(err => console.error(err));
};



  const totaleCarrello = itemCarrello.reduce(
    (sum, item) => sum + prezziSettore[item.enumSettore],
    0
  );

  return (
    <div className="container my-4">
      <h1 className="mb-4">Carrello</h1>

      {itemCarrello.length === 0 && <p>Il carrello è vuoto</p>}

      {itemCarrello.map((item) => {
        const prezzo = prezziSettore[item.enumSettore];
        return (
          <div key={item.id} className="card mb-3 shadow-sm">
            <div className="card-body card-bodyTicketShop">
              <h5 className="card-title">{item.ticket.day} - {item.ticket.date}</h5>
              <h6 className="card-subtitle mb-2 text-muted">{item.ticket.opponents} @ {item.ticket.stadium}</h6>

              <p>Prezzo: <strong>€{prezzo}</strong></p>

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Settore</label>
                  <select
                    className="form-select"
                    value={item.enumSettore}
                    onChange={(e) =>
                      aggiornaItem(item.id, e.target.value, item.enumFila, item.enumPosto)
                    }
                  >
                    {Object.keys(prezziSettore).map((settore) => (
                      <option key={settore} value={settore}>
                        {settore}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Fila</label>
                  <select
                    className="form-select"
                    value={item.enumFila}
                    onChange={(e) =>
                      aggiornaItem(item.id, item.enumSettore, e.target.value, item.enumPosto)
                    }
                  >
                    {[...Array(20)].map((_, i) => (
                      <option key={i} value={`FILA_${i + 1}`}>FILA_{i + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Posto</label>
                  <select
                    className="form-select"
                    value={item.enumPosto}
                    onChange={(e) =>
                      aggiornaItem(item.id, item.enumSettore, item.enumFila, e.target.value)
                    }
                  >
                    {"ABCDEFGHIJKLMNOPQR".split("").map((posto) => {
                      const key = item.enumSettore + "_" + item.enumFila;
                      const occupatoAltri = postiDisponibili[item.ticket.id]?.[key]?.includes(posto) ?? false;
                      const occupatoMioCarrello = itemCarrello.some(
                        (i) =>
                          i.id !== item.id &&
                          i.enumSettore === item.enumSettore &&
                          i.enumFila === item.enumFila &&
                          i.enumPosto === posto &&
                          i.ticket.id === item.ticket.id
                      );
                      const disabilita = (occupatoAltri || occupatoMioCarrello) && posto !== item.enumPosto;
                      return (
                        <option key={posto} value={posto} disabled={disabilita}>
                          {posto} {disabilita ? "(Occupato)" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="row g-3 mt-3">
  <div className="col-md-4 d-flex flex-column flex-md-row align-items-md-center">
    <label className="form-label me-md-2 mb-1 mb-md-0">Nome:</label>
    <input
      type="text"
      className="form-control"
      value={item.nome || ""}
      onChange={(e) => aggiornaInfo(item.id, { nome: e.target.value })}
    />
  </div>

  <div className="col-md-4 d-flex flex-column flex-md-row align-items-md-center">
    <label className="form-label me-md-2 mb-1 mb-md-0">Cognome:</label>
    <input
      type="text"
      className="form-control"
      value={item.cognome || ""}
      onChange={(e) => aggiornaInfo(item.id, { cognome: e.target.value })}
    />
  </div>

  <div className="col-md-4 d-flex flex-column flex-md-row align-items-md-center">
    <label className="form-label me-md-2 mb-1 mb-md-0">Data di nascita:</label>
    <input
      type="date"
      className="form-control"
      value={item.dataNascita || ""}
      onChange={(e) => aggiornaInfo(item.id, { dataNascita: e.target.value })}
    />
  </div>
</div>

              <div className="mt-3 d-flex justify-content-between align-items-center">
                <strong>Totale: €{prezzo}</strong>
                <button className="btn btn-danger btn-sm" onClick={() => eliminaTicket(item.id)}>
                  Elimina
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {itemCarrello.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <h4>Totale Carrello: €{totaleCarrello}</h4>
          <button className="btn btn-warning" onClick={svuotaCarrello}>
            Svuota Carrello
          </button>
          <button className="btn btn-success" onClick={paga}>
  Procedi al pagamento
</button>
        </div>
        
      )}
    </div>
  );
}

export default CarrelloTickets;