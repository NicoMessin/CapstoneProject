import { useEffect, useState } from "react";

function Carrello() {
  const [itemCarrello, setItemCarrello] = useState([]);

  const fetchCarrello = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/carrelloItemsShop/mio", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Errore fetching carrello")
      )
      .then((data) => setItemCarrello(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCarrello();
  }, []);

  const aggiornaItem = (id, quantita, taglia) => {
    const token = localStorage.getItem("token");

    fetch(
      `http://localhost:3001/carrelloItemsShop/${id}?quantita=${quantita}&taglia=${taglia}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Errore aggiornamento item");
        fetchCarrello();
      })
      .catch((err) => console.error(err));
  };

  const eliminaItem = (id) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3001/carrelloItemsShop/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore eliminazione item");
        fetchCarrello();
      })
      .catch((err) => console.error(err));
  };

  const svuotaCarrello = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/carrelloItemsShop/mio", {
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
    (sum, item) => sum + item.prodotto.price * item.quantita,
    0
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
          <h3>{item.prodotto.name_product}</h3>
          <img
            src={item.prodotto.imageUrl}
            alt={item.prodotto.name_product}
            width={100}
          />
          <p>Prezzo unitario: €{item.prodotto.price}</p>

          <label>Taglia:</label>
          <select
            value={item.enumTaglia}
            onChange={(e) =>
              aggiornaItem(item.id, item.quantita, e.target.value)
            }
          >
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>

          <label>Quantità:</label>
          <input
            type="number"
            value={item.quantita}
            min="1"
            onChange={(e) =>
              aggiornaItem(item.id, parseInt(e.target.value), item.enumTaglia)
            }
          />

          <p>Totale: €{item.prodotto.price * item.quantita}</p>
          <button onClick={() => eliminaItem(item.id)}>Elimina</button>
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

export default Carrello;