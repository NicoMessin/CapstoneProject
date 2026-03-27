
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "../css/Admin.css";

function AdminPanel(){

return(
<>

    <Navbar  bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand href="#home" ccl>Edit</Navbar.Brand>
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