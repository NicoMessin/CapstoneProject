import { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

 function Dashboard() {
  const [role, setRole] = useState("NON_LOGGATO"); 
  

  useEffect(() => {
  const checkUser = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setRole("NON_LOGGATO");
     
      return;
    }

    fetch("http://localhost:3001/auth/me", {
      headers: { "Authorization": "Bearer " + token }
    })
      .then(res => res.json())
      .then(data => {
        setRole(data.tipoUtente || "NON_LOGGATO");
       
      })
      .catch(() => {
        setRole("NON_LOGGATO");
       
      });
  };

  checkUser();
}, []);


  return (
  <div>
  <h1>Benvenuto sulla pagina pubblica!</h1>

  {/* Controllo login */}
  {role === "USER" ? (
    <UserDashboard />
  ) : role === "ADMIN" ? (
    <AdminDashboard />
  ) : (
    <p>Non sei loggato.</p>
  )}

  {/* Contenuto pubblico */}
  <p>Contenuto pubblico visibile a tutti.</p>
  </div>
);
  
} export default Dashboard