import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import cricketLogo from '../cricketLogo1.png';
import Button from 'react-bootstrap/Button';
import '../customBootstrap.css'

const NavbarComp = ({ valid }) => {
  return (
    <>
      <div className='nav_upper d-flex justify-content-end pe-5 py-2'>Contact: 9999999999</div>
      <Navbar expand="lg" className="navbar_comp sticky-top shadow-sm">
        <Container>
          {!valid ? (<>
            <Navbar.Brand href="/"><img src={cricketLogo} /></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">HOME</Nav.Link>
                <Nav.Link href="#link">OUR TEAM</Nav.Link>
                <Nav.Link href="#link">TROPHY ROOM</Nav.Link>
                <NavDropdown title=" BLOG" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Left Slidebar</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">Right Slidebar</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Blog List</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title=" PAGE" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Match Schedule</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">About Us</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">FAQs Page</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Services</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Contact Us</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title=" PORTFOLIO" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Left Slidebar</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">Right Slidebar</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Blog List</NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <hr/>
              <Button href='/login' variant="dark" size="sm">Log In / Register</Button>
            </Navbar.Collapse>
          </>) : (<>
            <div className='d-flex w-100'>
              <Navbar.Brand href="/"><img src={cricketLogo} /></Navbar.Brand>
              <Navbar.Collapse id="basic-navbar-nav" className='justify-content-end'>
                <Button href='/' variant="outline-dark" size="sm">HOME</Button>
              </Navbar.Collapse>
            </div>
          </>)}
        </Container>
      </Navbar>
    </>
  )
}

export default NavbarComp
