import { useEffect, useState } from "react";

function Dashboard() {
  const [role, setRole] = useState("NON_LOGGATO");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setRole("NON_LOGGATO");
      return;
    }

    fetch("http://localhost:3001/auth/me", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        setRole(data.tipoUtente || "NON_LOGGATO");
        setUser(data); // salvo tutto l'utente
      })
      .catch(() => {
        setRole("NON_LOGGATO");
      });
  }, []);

  return (
    <div className="page">
      {/* NAVBAR */}
      <div className="navbar">
        <h2 className="logo">MyProfile</h2>

        <div>
          {role !== "NON_LOGGATO" ? (
            <button
              className="logoutBtn"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
            >
              Logout
            </button>
          ) : (
            <span className="badge">Guest</span>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="containerDash">
        <div className="cardDash">
          {/* INFO UTENTE */}
          {user && (
            <div className="userInfo">
              <p>
                <strong>Nome:</strong> {user.nome}
              </p>
              <p>
                 <strong>Cognome:</strong> {user.cognome}

              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <hr />
            </div>
          )}

          <h1>Dashboard</h1>

          {role === "USER" && (
            <>
              <p className="subtitle">Benvenuto utente <i className="bi bi-person-raised-hand"></i></p>
              
            </>
          )}

          {role === "ADMIN" && (
            <>
              <p className="subtitle">Pannello amministratore <i className="bi bi-gear"></i></p>
             
            </>
          )}

          {role === "NON_LOGGATO" && (
            <p className="warning">Devi effettuare il login</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
