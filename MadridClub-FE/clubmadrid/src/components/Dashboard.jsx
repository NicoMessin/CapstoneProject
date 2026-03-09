import { useEffect, useState } from "react";

 function Dashboard() {
  const [role, setRole] = useState("NON_LOGGATO"); // stato iniziale
  const [loading, setLoading] = useState(true);    // per mostrare caricamento

  useEffect(() => {
  const checkUser = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setRole("NON_LOGGATO");
      setLoading(false);
      return;
    }

    fetch("http://localhost:3001/auth/me", {
      headers: { "Authorization": "Bearer " + token }
    })
      .then(res => res.json())
      .then(data => {
        setRole(data.tipoUtente || "NON_LOGGATO");
        setLoading(false);
      })
      .catch(() => {
        setRole("NON_LOGGATO");
        setLoading(false);
      });
  };

  checkUser();
}, []);

  if (loading) return <div>Caricamento...</div>;

  return (
    <div>
      <h1>Benvenuto sulla pagina pubblica!</h1>

      {/* Profilo se loggato */}
      {role === "USER" || role === "ADMIN" ? (
        <div>
          <p>Sei loggato come: {role}</p>
        </div>
      ) : (
        <p>Non sei loggato.</p>
      )}

      {/* Voce extra Admin */}
      {role === "ADMIN" && (
        <div style={{ marginTop: "20px", color: "red" }}>
          <strong>Voce Admin:</strong> gestione utenti, ticket, news...
        </div>
      )}

      {/* Contenuto pubblico */}
      <p>Contenuto pubblico visibile a tutti.</p>
    </div>
  );
} export default Dashboard