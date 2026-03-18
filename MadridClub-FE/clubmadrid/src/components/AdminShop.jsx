import { useEffect, useState } from "react"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function AdminShop(){
    const[product, setProduct]= useState([])
    const[form, setForm]= useState({
        name_product: "",
        description: "",
        price: "",
        imageUrl:""
    })

    //GET PRODUCT
    const getProducts = ()=>{
        fetch("http://localhost:3001/products")
        .then((res)=>{if(!res.ok) throw new Error("Errore nel recupero dei prodotti")
            return res.json()
        })
        .then((data)=>{setProduct(data)})
        .catch((err)=> console.error(err))
    }
    useEffect(() => {
  getProducts()
}, [])

//AGGIUNGI PRODOTTI
const handleSubmit = (e) => {
  e.preventDefault()
fetch("http://localhost:3001/products", {
    method: "POST",
    headers:{
        "Content-Type": "application/json", 
        Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify(form)
})
.then(()=>getProducts())
.catch((err)=>console.error(err))
}

// DELETE PRODOTTO
const deleteProduct = (id) => {
  fetch(`http://localhost:3001/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  })
  .then(() => getProducts())
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

<h2>Aggiungi Prodotto</h2>

<form onSubmit={handleSubmit}>
<input placeholder="Nome del prodotto"
onChange={(e)=>setForm({...form, name_product:e.target.value})}
/>

<input placeholder="Descrizione"
onChange={(e)=>setForm({...form,description:e.target.value})}
/>

<input placeholder="Image URL"
onChange={(e)=>setForm({...form,imageUrl:e.target.value})}
/>

<input type="number"
onChange={(e)=>setForm({...form,price:e.target.value})}
/>

<button type="submit">Aggiungi</button>
</form>

<h2>Lista Prodotti</h2>

{product.map(n => (
    <div key={n.id}>
<h3>{n.name_product}</h3>
<button onClick={()=>deleteProduct(n.id)}>Elimina</button>
</div>
))}

</div>
</>
    )
}
export default AdminShop