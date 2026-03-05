import Sidebar from "./Sidebar";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/General.css";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';

function UpperBar() {
    const navigate = useNavigate();
  return (
    <Container fluid className="bg-secondary">
     <Row className="align-items-center  py-md-3">

  {/* SINISTRA */}
  <Col xs={4} className="d-flex justify-content-start align-items-center ">
  <div className="d-block d-md-none mt-5">
    <Sidebar />
  </div>


    <div className="d-none d-md-flex">
      <Nav.Link as={Link} to="/" className="mx-3">HOME</Nav.Link>
      <Nav.Link as={Link} to="/tickets" className="mx-3">TICKETS</Nav.Link>
      <Nav.Link as={Link} to="/shop" className="mx-3">SHOP</Nav.Link>
    </div>
  </Col>

  {/* CENTRO */}
  <Col xs={4} md={4} className="d-flex justify-content-center">
    <img
      src="/images/Real_Madrid_CF_logo.svg.png"
      alt="logo Real"
      className="logoimg"  onClick={() => navigate('/')}
      
    />
  </Col>

  {/* DESTRA */}
  <Col xs={4} md={4} className="d-flex justify-content-end align-items-center">

    {/* Mobile */}
  
<Dropdown className="d-block d-md-none">
      <Dropdown.Toggle  id="dropdown-basic"  variant="secondary">
             <i className="bi bi-person-fill fs-3 mx-3"></i>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="/auth/Login" >Login</Dropdown.Item>
        <Dropdown.Item href="/auth/Register">Register</Dropdown.Item>
        <Dropdown.Item href="/Profile">Profile</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    {/* Desktop */}
    <div className="d-none d-md-flex align-items-center">
      <img src="/images/Logo_Adidas.png" alt="logoAdidas" className="mx-3 adidasLogo" />
      <img src="/images/emirates-logo.png" alt="logoEmirates" className="mx-3 emiratesLogo" />
     <Dropdown>
      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
             <i className="bi bi-person-fill fs-3 mx-3"></i>
      </Dropdown.Toggle>

      <Dropdown.Menu>
         <Dropdown.Item href="/auth/Login" >Login</Dropdown.Item>
        <Dropdown.Item href="/auth/Register">Register</Dropdown.Item>
        <Dropdown.Item href="/Profile">Profile</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
      <i className="bi bi-gear text-black settings-btn fs-3  mx-3"></i>
    </div>

 



  </Col>

</Row>
    </Container>
  );
}

export default UpperBar;
