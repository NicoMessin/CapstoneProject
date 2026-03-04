import { useState } from "react";
import Nav from "react-bootstrap/Nav";
import "../css/General.css";
import { Link } from "react-router-dom";

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="d-block">
      {/* Hamburger per aprire */}
      {!open && (
        <button className="toggle-btn" onClick={() => setOpen(true)}>
          <i className="bi bi-list"></i>
        </button>
      )}

      {/* Overlay + sidebar */}
      <div className={`sidebar-overlay ${open ? "open" : ""}`}>
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-3 w-100">
          <button className="close-btn" onClick={() => setOpen(false)}>
            <i className="bi bi-x"></i>
          </button>
          <i className="bi bi-gear text-white settings-btn btnSettings"></i>
        </div>

        {/* Links allineati a sinistra */}
        <Nav className="flex-column ps-3 mt-4">
          <Nav.Link as={Link} to="/" onClick={() => setOpen(false)}>
            HOME
          </Nav.Link>

          <Nav.Link as={Link} to="/tickets " onClick={() => setOpen(false)}>
            TICKETS
          </Nav.Link>

          <Nav.Link as={Link} to="/shop" onClick={() => setOpen(false)}>
            SHOP
          </Nav.Link>
        </Nav>

      </div>
    </div>
  );
}

export default Sidebar;