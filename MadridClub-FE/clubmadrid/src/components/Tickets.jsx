import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Tickets() {
  const[ticket, setTicket]= useState([])
  const [cartCount, setCartCount] = useState(0);
  const navigate= useNavigate()
 useEffect(()=>{
  fetch("http://localhost:3001/tickets")
  .then((res)=>{
    if(!res.ok) throw new Error("Errore nel recupero del ticket")
       return res.json();
  })
  .then((data)=>{setTicket(data)})
  .catch((err)=>console.error("Errore fetching ticket:", err));

 }, []);
 if(ticket.length=== 0){
  return <p>Impossibile caricare i tickets.</p>;
  }
 


  return (
    <Container fluid className="sfondoTickets">
      <Row className="d-flex align-items-center bg-dark">
        <Col xs={2} ></Col>
        <Col xs={8} className=""><h1 className="d-flex justify-content-center mt-2 text-white">BIGLIETTI</h1></Col>

        <Col xs={2} className="text-end ">
          <i className="bi bi-search mx-2 fs-5 text-white"></i>
          
          <span className=" position-relative">
          <i className="bi bi-ticket-perforated mx-2 fs-5 text-white" onClick={()=>navigate('/carrelloItemsShop')}></i>
            
           {cartCount > 0 && (
      <span className="cartCount"
      >
        {cartCount}
        </span>
           )}
      </span>
        </Col>
      </Row>
<Row>

   {ticket.map((item)=>(
          
        
     <Col key={item.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
      <div className="card-body bg-secondary rounded-4 d-flex flex-column justify-content-center align-items-center mt-5 ">
        <h5 className="card-title">{item.day}</h5>
        <p className="card-text">{item.date}</p>
        <p className="card-text">{item.opponents}</p>
        <p className="card-text">{item.stadium}</p>
        <button className="btn btn-primary" onClick={()=>setCartCount(prev =>prev+1)}>Acquista</button>
      </div>
      </Col>
  
        ))}


       
</Row>
    </Container>
  );
}
export default Tickets;
