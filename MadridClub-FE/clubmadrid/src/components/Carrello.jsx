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
    
    
    //STRIPE
    const paga = () => {
      const token = localStorage.getItem("token");
      const items = itemCarrello.map(item => ({
        name: item.prodotto.name_product,
        price: item.prodotto.price,
        quantity: item.quantita
      }));
      
      fetch("http://localhost:3001/stripe/checkout/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(items)
      })
      .then(res => {
        if (!res.ok) throw new Error("Errore creazione sessione pagamento");
        return res.json();
      })
      .then(data => {
        window.location.href = data.url;
      })
      .catch(err => {
        console.error(err);
        alert("Errore durante il pagamento");
      });
  };
  
  // 🔹 Controllo successUrl per alert e svuotamento carrello
  
  
  

  return (
    <div className="container my-4">
    <h1 className="mb-4">Carrello</h1>

    {itemCarrello.length === 0 && <p>Il carrello è vuoto</p>}

    {itemCarrello.map((item) => (
      <div key={item.id} className="card mb-3 shadow-sm">
        <div className="row g-3 align-items-center p-3">
          {/* Immagine */}
          <div className="col-sm-2 text-center">
            <img
              src={item.prodotto.imageUrl}
              alt={item.prodotto.name_product}
              className="img-fluid rounded"
            />
          </div>

          {/* Info prodotto */}
          <div className="col-sm-6">
            <h5 className="card-title">{item.prodotto.name_product}</h5>
            <p className="mb-1">Prezzo unitario: <strong>€{item.prodotto.price}</strong></p>

            <div className="row g-2">
              <div className="col-6 col-md-4">
                <label className="form-label">Taglia</label>
                <select
                  className="form-select"
                  value={item.enumTaglia}
                  onChange={(e) => aggiornaItem(item.id, item.quantita, e.target.value)}
                >
                  {["XS","S","M","L","XL","XXL"].map((taglia) => (
                    <option key={taglia} value={taglia}>{taglia}</option>
                  ))}
                </select>
              </div>

              <div className="col-6 col-md-4">
                <label className="form-label">Quantità</label>
                <input
                  type="number"
                  className="form-control"
                  value={item.quantita}
                  min="1"
                  onChange={(e) => aggiornaItem(item.id, parseInt(e.target.value), item.enumTaglia)}
                />
              </div>
            </div>
          </div>

          {/* Totale e pulsante */}
          <div className="col-sm-4 d-flex flex-column align-items-end justify-content-between">
            <p className="mb-2">Totale: <strong>€{item.prodotto.price * item.quantita}</strong></p>
            <button className="btn btn-danger btn-sm" onClick={() => eliminaItem(item.id)}>
              Elimina
            </button>
          </div>
        </div>
      </div>
    ))}

    {/* Totale globale */}
    {itemCarrello.length > 0 && (
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h4>Totale Carrello: €{totaleCarrello}</h4>
        <button className="btn btn-warning mb-2" onClick={svuotaCarrello}>
          Svuota Carrello
        </button>
      </div>
      
    )}
    <button className="btn btn-success" onClick={paga}>
  Procedi al pagamento
</button>
  </div>
);
}

export default Carrello;