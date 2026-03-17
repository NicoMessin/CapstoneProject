import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Success() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams(location.search);
    const type = params.get("type");

    // Mostra alert pagamento
    alert("Pagamento andato a buon fine 🎉");

    // Se è un acquisto shop, svuota carrello shop
    const promises = [];
    if (type === "shop") {
      promises.push(
        fetch("http://localhost:3001/carrelloItemsShop/mio", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
      );
    }

    // Se è un acquisto ticket, conferma acquisto e svuota carrello
    if (type === "tickets") {
      promises.push(
        fetch("http://localhost:3001/carrelloTickets/conferma-acquisto", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
          if (!res.ok) throw new Error("Errore conferma acquisto");
          return res.json();
        })
      );
    }

    // Quando tutte le operazioni finiscono, naviga
    Promise.all(promises)
      .then((data) => {
        if (type === "tickets") console.log("Biglietti acquistati:", data[0]);
        navigate(type === "tickets" ? "/myTickets" : "/");
      })
      .catch((err) => console.error(err));
  }, [navigate, location]);

  return null;
}

export default Success;