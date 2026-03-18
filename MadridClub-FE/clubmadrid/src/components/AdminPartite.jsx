import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
function AdminPartite() {
  const [match, setMatch] = useState([]);
  const [form, setForm] = useState({
    casa: "",
    trasferta: "",
    data: "",
  });

  // GET MATCH
  const getMatches = () => {
    fetch("http://localhost:3001/partite")
      .then((res) => res.json())
      .then((data) => setMatch(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getMatches();
  }, []);

  // AGGIUNGI MATCH
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:3001/partite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(form),
    })
      .then(() => getMatches())
      .catch((err) => console.log(err));
  };

  // DELETE MATCH
  const deleteMatch = (id) => {
    fetch(`http://localhost:3001/partite/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(() => getMatches())
      .catch((err) => console.log(err));
  };
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/adminNews">NEWS</Nav.Link>
              <Nav.Link href="/adminShop">SHOP</Nav.Link>
              <Nav.Link href="/adminTickets">TICKETS</Nav.Link>
              <Nav.Link href="/adminPartite">PARTITE</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div>
        <h2>Aggiungi Match</h2>

        <form onSubmit={handleSubmit}>
          <input
           type="text"
    placeholder="Squadra di casa"
            onChange={(e) => setForm({ ...form, casa: e.target.value })}
          />

          <input
           type="text"
    placeholder="Squadra trasferta"
            onChange={(e) => setForm({ ...form, trasferta: e.target.value })}
          />

          <input
           type="date"
    placeholder="Data"
            onChange={(e) => setForm({ ...form, data: e.target.value })}
          />

          <button type="submit">Aggiungi</button>
        </form>

        <h2>Lista Partite</h2>

        {match.map((n) => (
          <div key={n.id}>
            <span>{n.casa + " VS "}</span>
            <span>{n.trasferta + " : "}</span>
            <span className="me-2">{n.data}</span>
            <button onClick={() => deleteMatch(n.id)}>Elimina</button>
          </div>
        ))}
      </div>
    </>
  );
}
export default AdminPartite;
