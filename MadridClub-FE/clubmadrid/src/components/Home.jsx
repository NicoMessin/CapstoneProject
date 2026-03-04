import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


function Home() {
  return (
    <>

 
    {/* PRIMO CAROSELLO */}
    <Carousel interval={null} className='mt-4'> 
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/Real_Madrid_CF_logo.svg.png"
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Testo esempio</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/Real_Madrid_CF_logo.svg.png"
          alt="Second slide"
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/Real_Madrid_CF_logo.svg.png"
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
    {/* SECONDO CAROSELLO */}
    
     <Carousel className="carousel-peek">
      
      {/* PRIMO SLIDE */}
      <Carousel.Item>
        <div className="d-flex justify-content-center py-5 w-100">
          <Card style={{ width: '18rem' }} className="border border-3 rounded">
            <Card.Img variant="top" src="/images/Real_Madrid_CF_logo.svg.png" />
            <Card.Body>
              <Card.Title>Card Title</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the bulk of the card's content.
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
        </div>
      </Carousel.Item>

      {/* SECONDO SLIDE */}
      <Carousel.Item>
        <div className="d-flex justify-content-center py-5 w-100">
          <Card style={{ width: '18rem' }} className="border border-3 rounded">
            <Card.Img variant="top" src="/images/Real_Madrid_CF_logo.svg.png" />
            <Card.Body>
              <Card.Title>Card Title</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the bulk of the card's content.
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
        </div>
      </Carousel.Item>

      {/* TERZO SLIDE */}
      <Carousel.Item>
        <div className="d-flex justify-content-center py-5 w-100">
          <Card style={{ width: '18rem' }} className="border border-3 rounded">
            <Card.Img variant="top" src="/images/Real_Madrid_CF_logo.svg.png" />
            <Card.Body>
              <Card.Title>Card Title</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the bulk of the card's content.
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
        </div>
      </Carousel.Item>

    </Carousel>
          </>
  );
}

export default Home;