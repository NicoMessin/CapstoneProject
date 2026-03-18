
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function AdminPanel(){

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


    <h1>ADMIN PANEL</h1>
  



</>
)
}

export default AdminPanel