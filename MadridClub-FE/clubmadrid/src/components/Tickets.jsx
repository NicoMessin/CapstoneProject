import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";

function Tickets() {
  const[ticket, setTicket]= useState([])
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
    <Container fluid>
      <Row className="d-flex align-items-center">
        <Col xs={4}></Col>
        <Col xs={4} className=" mt-2 d-flex justify-content-center">
          
          <h1>BIGLIETTI</h1>
        </Col>

        <Col xs={4} className="text-end mt-2">
          <i className="bi bi-search mx-2 fs-5 "></i>
          <i className="bi bi-ticket-perforated mx-2 fs-5"></i>
        </Col>
      </Row>
<Row>

      <Carousel 
              >
        {ticket.map((item)=>(

  <Carousel.Item key={item.id}>
    <div className="card text-center mx-auto w-100 " >
      <div className="card-body bg-danger ticketCard">
        <h5 className="card-title">{item.day}</h5>
        <p className="card-text">{item.date}</p>
        <p className="card-text">{item.opponents}</p>
        <p className="card-text">{item.stadium}</p>
        <button className="btn btn-primary">Acquista</button>
      </div>
    </div>
  </Carousel.Item>
        ))}

</Carousel>
</Row>
    </Container>
  );
}
export default Tickets;
