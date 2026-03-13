import { useEffect, useState } from "react";

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

  // Fetch sicuro del carrello
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

  // Fetch posti disponibili per ticket (settore+fila)
  const fetchPostiDisponibili = (ticketId) => {
    const token = localStorage.getItem("token");
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
  const token = localStorage.getItem("token");
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

  const totaleCarrello = itemCarrello.reduce(
    (sum, item) => sum + prezziSettore[item.enumSettore],
    0
  );

  return (
    <div>
      <h1>CARRELLO</h1>

      {itemCarrello.length === 0 && <p>Il carrello è vuoto</p>}

      {itemCarrello.map((item) => {
        const prezzo = prezziSettore[item.enumSettore];

        return (
          <div key={item.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
            <h3>{item.ticket.day}</h3>
            <h3>{item.ticket.date}</h3>
            <h3>{item.ticket.opponents}</h3>
            <h3>{item.ticket.stadium}</h3>

            <p>Prezzo: €{prezzo}</p>

            <label>Settore:</label>
            <select
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

            <label>Fila:</label>
            <select
              value={item.enumFila}
              onChange={(e) =>
                aggiornaItem(item.id, item.enumSettore, e.target.value, item.enumPosto)
              }
            >
              {[...Array(20)].map((_, i) => (
                <option key={i} value={`FILA_${i + 1}`}>
                  FILA_{i + 1}
                </option>
              ))}
            </select>

            <label>Posto:</label>
            <select
              value={item.enumPosto}
              onChange={(e) =>
                aggiornaItem(item.id, item.enumSettore, item.enumFila, e.target.value)
              }
            >
              {"ABCDEFGHIJKLMNOPQR".split("").map((posto) => {
                const key = item.enumSettore + "_" + item.enumFila;
                const occupatoAltri =
                  postiDisponibili[item.ticket.id]?.[key]?.includes(posto) ?? false;

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
<label>Nome:</label>
<input
  type="text"
  value={item.nome || ""}
  onChange={(e) => aggiornaInfo(item.id, { nome: e.target.value })}
/>

<label>Cognome:</label>
<input
  type="text"
  value={item.cognome || ""}
  onChange={(e) => aggiornaInfo(item.id, { cognome: e.target.value })}
/>

<label>Data di nascita:</label>
<input
  type="date"
  value={item.dataNascita || ""}
  onChange={(e) => aggiornaInfo(item.id, { dataNascita: e.target.value })}
/>
            <p>Totale: €{prezzo}</p>
            <button onClick={() => eliminaTicket(item.id)}>Elimina</button>
          </div>
        );
      })}

      <h2 style={{ marginTop: "20px" }}>Totale Carrello: €{totaleCarrello}</h2>

      {itemCarrello.length > 0 && (
        <button onClick={svuotaCarrello} style={{ marginTop: "20px" }}>
          Svuota Carrello
        </button>
      )}
    </div>
  );
}

export default CarrelloTickets;