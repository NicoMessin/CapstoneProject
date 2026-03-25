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
      <h2>Pagamento completato <i className="bi bi-patch-check-fill text-secondary "></i></h2>
     
    </div>
  );
}

export default Success;