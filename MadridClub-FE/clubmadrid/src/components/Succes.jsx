import { useEffect } from "react";

function Success() {

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/carrelloTickets/conferma-acquisto", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(() => {
      console.log("Acquisto confermato");
    })
    .catch(err => console.error(err));

  }, []);

  return (
    <div className="container mt-5">
      <h2>Pagamento completato ✅</h2>
      <p>I tuoi biglietti sono stati acquistati.</p>
    </div>
  );
}

export default Success;