import { useEffect, useState } from "react"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function AdminNews(){

const [news, setNews] = useState([])
const [form, setForm] = useState({
  title: "",
  description: "",
  imageUrl: "",
  publishedAt: ""
})

// GET NEWS
const getNews = () => {
  fetch("http://localhost:3001/news")
    .then(res => res.json())
    .then(data => setNews(data))
    .catch(err => console.log(err))
}

useEffect(() => {
  getNews()
}, [])

// AGGIUNGI NEWS
const handleSubmit = (e) => {
  e.preventDefault()

  fetch("http://localhost:3001/news", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify(form)
  })
  .then(() => getNews())
  .catch(err => console.log(err))
}

// DELETE NEWS
const deleteNews = (id) => {
  fetch(`http://localhost:3001/news/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  })
  .then(() => getNews())
  .catch(err => console.log(err))
}

return(
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

<h2>Aggiungi News</h2>

<form onSubmit={handleSubmit}>
<input placeholder="Titolo"
onChange={(e)=>setForm({...form,title:e.target.value})}
/>

<input placeholder="Descrizione"
onChange={(e)=>setForm({...form,description:e.target.value})}
/>

<input placeholder="Image URL"
onChange={(e)=>setForm({...form,imageUrl:e.target.value})}
/>

<input type="datetime-local"
onChange={(e)=>setForm({...form,publishedAt:e.target.value})}
/>

<button type="submit">Aggiungi</button>
</form>

<h2>Lista News</h2>

{news.map(n => (
    <div key={n.id}>
<h3>{n.title}</h3>
<button onClick={()=>deleteNews(n.id)}>Elimina</button>
</div>
))}

</div>
</>
)
}

export default AdminNews