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
        res.ok ? res.json() : Promise.reject("Errore fetching carrello"),
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
      },
    )
      .then((res) => {
        if (!res.ok) throw new Error("Errore aggiornamento item");
        fetchCarrello();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h1>CARRELLO</h1>
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
        </div>
      ))}
    </div>
  );
}

export default Carrello;
