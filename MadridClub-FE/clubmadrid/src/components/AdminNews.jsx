import { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function AdminNews() {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    publishedAt: ""
  });
  const [editingId, setEditingId] = useState(null);

  // GET NEWS
  const getNews = () => {
    fetch("http://localhost:3001/news")
      .then(res => res.json())
      .then(data => setNews(data))
      .catch(err => console.log(err));
  }

  useEffect(() => { getNews() }, []);

  // AGGIUNGI / MODIFICA NEWS
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:3001/news/${editingId}`
      : "http://localhost:3001/news";
    const method = editingId ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify(form)
    })
    .then(() => {
      getNews();
      setForm({ title: "", description: "", imageUrl: "", publishedAt: "" });
      setEditingId(null); // reset form
    })
    .catch(err => console.log(err));
  }

  // DELETE NEWS
  const deleteNews = (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa news?")) return;
    fetch(`http://localhost:3001/news/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
    .then(() => getNews())
    .catch(err => console.log(err));
  }

  // INIZIA MODIFICA
  const editNews = (n) => {
    setForm({
      title: n.title,
      description: n.description,
      imageUrl: n.imageUrl,
      publishedAt: n.publishedAt
    });
    setEditingId(n.id);
  }

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
        <h2>{editingId ? "Modifica News" : "Aggiungi News"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Titolo"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            placeholder="Descrizione"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <input
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
          <input
            type="datetime-local"
            value={form.publishedAt}
            onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
            required
          />
          <button type="submit">{editingId ? "Salva Modifiche" : "Aggiungi"}</button>
          {editingId && (
            <button type="button" onClick={() => { 
              setForm({ title: "", description: "", imageUrl: "", publishedAt: "" });
              setEditingId(null);
            }}>Annulla</button>
          )}
        </form>

        <h2>Lista News</h2>
        {news.map(n => (
          <div key={n.id}>
            <h3>{n.title}</h3>
            <p>{n.description}</p>
            <button onClick={() => editNews(n)}>Modifica</button>
            <button onClick={() => deleteNews(n.id)}>Elimina</button>
          </div>
        ))}
      </div>
    </>
  )
}

export default AdminNews;