import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Success() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    alert("Pagamento andato a buon fine 🎉");

    const token = localStorage.getItem("token");

    const params = new URLSearchParams(location.search);
    const type = params.get("type");

    if (type === "shop") {
      fetch("http://localhost:3001/carrelloItemsShop/mio", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => console.error(err));
    }

    if (type === "tickets") {
      fetch("http://localhost:3001/carrelloTickets/mio", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => console.error(err));
    }

    navigate("/");
  }, [navigate, location]);

  return null;
}

export default Success;