import { useEffect, useState } from "react";

function CarrelloTickets() {
  const [itemCarrello, setItemCarrello] = useState([]);

  const fetchCarrello = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/carrelloTickets/mio", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Errore fetching carrello"),
      )
      .then((data) => setItemCarrello(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCarrello();
  }, []);
  const aggiornaItem = (id, enumSettore, enumFila, enumPosto) => {
    const token = localStorage.getItem("token");

    fetch(
      `http://localhost:3001/carrelloTickets/${id}?enumSettore=${enumSettore}&enumFila=${enumFila}&enumPosto=${enumPosto}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((res) => {
        if (!res.ok) throw new Error("Errore aggiornamento ticket");
        fetchCarrello();
      })
      .catch((err) => console.error(err));
  };

  const eliminaTicket = (id) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3001/carrelloTickets/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore eliminazione ticket");
        fetchCarrello();
      })
      .catch((err) => console.error(err));
  };

  const svuotaCarrello = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/carrelloTickets/mio", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore svuotamento carrello");
        fetchCarrello();
      })
      .catch((err) => console.error(err));
  };

  // 🔹 Calcolo totale globale
  const totaleCarrello = itemCarrello.reduce(
    (sum, item) => sum + item.ticket.price,
    0,
  );

  return (
    <div>
      <h1>CARRELLO</h1>
      {itemCarrello.length === 0 && <p>Il carrello è vuoto</p>}

      {itemCarrello.map((item) => (
        <div
          key={item.id}
          style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}
        >
          <h3>{item.ticket.day}</h3>
          <h3>{item.ticket.date}</h3>
          <h3>{item.ticket.opponents}</h3>
          <h3>{item.ticket.stadium}</h3>

          <p>Prezzo unitario: €{item.ticket.price}</p>

          <label>Settore:</label>
          <select
            value={item.enumSettore}
            onChange={(e) =>
              aggiornaItem(
                item.id,
                e.target.value,
                item.enumFila,
                item.enumPosto,
              )
            }
          >
            <option value="FONDO_SUR">FONDO_SUR</option>
            <option value="LATERAL_ESTE">LATERAL_ESTE</option>
            <option value="LATERAL_OESTE">LATERAL_OESTE</option>
            <option value="FONDO_NORTE">FONDO_NORTE</option>
            <option value="ZONA_PRENSA">ZONA_PRENSA</option>
            <option value="VIP_BOXES">VIP_BOXES</option>
            <option value="PISTA">PISTA</option>
            <option value="PMR">PMR</option>
            <option value="APMR">APMR</option>
          </select>

          <label>Fila:</label>
          <select
            value={item.enumFila}
            onChange={(e) =>
              aggiornaItem(
                item.id,
                item.enumSettore,
                e.target.value,
                item.enumPosto,
              )
            }
          >
            <option value="FILA_1">FILA_1</option>
            <option value="FILA_2">FILA_2</option>
            <option value="FILA_3">FILA_3</option>
            <option value="FILA_4">FILA_4</option>
            <option value="FILA_5">FILA_5</option>
            <option value="FILA_6">FILA_6</option>
            <option value="FILA_7">FILA_7</option>
            <option value="FILA_8">FILA_8</option>
            <option value="FILA_9">FILA_9</option>
            <option value="FILA_10">FILA_10</option>
            <option value="FILA_11">FILA_11</option>
            <option value="FILA_12">FILA_12</option>
            <option value="FILA_13">FILA_13</option>
            <option value="FILA_14">FILA_14</option>
            <option value="FILA_15">FILA_15</option>
            <option value="FILA_16">FILA_16</option>
            <option value="FILA_17">FILA_17</option>
            <option value="FILA_18">FILA_18</option>
            <option value="FILA_19">FILA_19</option>
            <option value="FILA_20">FILA_20</option>
          </select>
          <label>Posto:</label>
          <select
            value={item.enumPosto}
            onChange={(e) =>
              aggiornaItem(
                item.id,
                item.enumSettore,
                item.enumFila,
                e.target.value,
              )
            }
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
            <option value="H">H</option>
            <option value="I">I</option>
            <option value="J">J</option>
            <option value="K">K</option>
            <option value="L">L</option>
            <option value="M">M</option>
            <option value="N">N</option>
            <option value="O">O</option>
            <option value="P">P</option>
            <option value="Q">Q</option>
            <option value="R">R</option>
          </select>

          <p>Totale: €{item.ticket.price}</p>
          <button onClick={() => eliminaTicket(item.id)}>Elimina</button>
        </div>
      ))}

      {/* 🔹 Totale globale */}
      <h2 style={{ marginTop: "20px" }}>Totale Carrello: €{totaleCarrello}</h2>

      {/* 🔹 Pulsante svuota carrello */}
      {itemCarrello.length > 0 && (
        <button onClick={svuotaCarrello} style={{ marginTop: "20px" }}>
          Svuota Carrello
        </button>
      )}
    </div>
  );
}
export default CarrelloTickets;
