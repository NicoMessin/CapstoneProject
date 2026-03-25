
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function AdminPanel(){

return(
<>

    <Navbar expand="lg" bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand href="#home">Admin Panel</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link href="/adminNews">News</Nav.Link>
              <Nav.Link href="/adminShop">Shop</Nav.Link>
              <Nav.Link href="/adminTickets">Tickets</Nav.Link>
              <Nav.Link href="/adminPartite">Partite</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>


    <h1 className='ms-3'>ADMIN PANEL</h1>
  



</>
)
}

export default AdminPanel