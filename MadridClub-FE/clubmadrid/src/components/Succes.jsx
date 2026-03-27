import { useEffect } from "react";

function Success() {
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Chiamata DELETE per svuotare il carrello
    fetch("http://localhost:3001/carrelloItemsShop/mio", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => console.log("Carrello shop svuotato"))
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-5">
      <h2>Pagamento completato <i className="bi bi-patch-check-fill text-success"></i></h2>
      <p>Il tuo carrello è stato svuotato.</p>
    </div>
  );
}

export default Success;