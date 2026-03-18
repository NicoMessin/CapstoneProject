import { useEffect, useState } from "react"
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

function AdminTickets(){

const [tickets, setTickets] = useState([])

const [form, setForm] = useState({
  day: "",
  date: "",
  opponents: "",
  stadium: "",
  price: ""
})
const [editingId, setEditingId] = useState(null);

// GET TICKETS
const getTickets = () => {
  fetch("http://localhost:3001/tickets")
    .then(res => res.json())
    .then(data => setTickets(data))
    .catch(err => console.log(err))
}

useEffect(() => {
  getTickets()
}, [])

 // AGGIUNGI / MODIFICA TICKET
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:3001/tickets/${editingId}`
      : "http://localhost:3001/tickets";
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
      getTickets();
      setForm({ day: "", date: "", opponents: "", stadium: "", price: "" });
      setEditingId(null); // reset form
    })
    .catch(err => console.log(err));
  }

// DELETE TICKET
const deleteTicket = (id) => {
   if (!window.confirm("Sei sicuro di voler eliminare questo ticket?")) return;
  fetch(`http://localhost:3001/tickets/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  })
  .then(() => getTickets())
  .catch(err => console.log(err))
}
// INIZIA MODIFICA
  const editTicket = (n) => {
    setForm({
      day: n.day,
      date: n.date,
      opponents: n.opponents,
      stadium: n.stadium,
      price: n.price
    });
    setEditingId(n.id);
  }

return(
<>

<Navbar expand="lg" className="bg-body-tertiary">
  <Container>
    <Navbar.Brand>Admin Panel</Navbar.Brand>
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

<h2>Aggiungi Ticket</h2>

<form onSubmit={handleSubmit}>

<input
placeholder="Giorno"
value={form.day}
onChange={(e)=>setForm({...form, day:e.target.value})}
/>

<input
type="datetime-local"
value={form.date}
onChange={(e)=>setForm({...form, date:e.target.value})}
/>

<input
placeholder="Avversario"
value={form.opponents}
onChange={(e)=>setForm({...form, opponents:e.target.value})}
/>

<input
placeholder="Stadio"
value={form.stadium}
onChange={(e)=>setForm({...form, stadium:e.target.value})}
/>

<input
type="number"
placeholder="Price"
step="0.01"
value={form.price}
onChange={(e)=>setForm({...form, price:Number(e.target.value)})}
/>

 <button type="submit">{editingId ? "Salva Modifiche" : "Aggiungi"}</button>
          {editingId && (
            <button type="button" onClick={() => { 
              setForm({ day: "", date: "", opponents: "", stadium: "" , price:""});
              setEditingId(null);
            }}>Annulla</button>
          )}

</form>

<h2>Lista Tickets</h2>

{tickets.map(n => (
<div key={n.id}>
<h3>{n.day} - {n.opponents}</h3>
<p>{n.stadium} | €{n.price}</p>
 <button onClick={() => editTicket(n)}>Modifica</button>
<button onClick={() => deleteTicket(n.id)}>Elimina</button>
</div>
))}

</div>

</>
)
}

export default AdminTickets