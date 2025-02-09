import { Navbar, Nav, Container } from 'react-bootstrap';
import React from 'react';
import { Gi3dGlasses } from "react-icons/gi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { CiLogin, CiLogout } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the user's token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    
    // Optionally, redirect the user to the login page
    navigate('/login');
  };

 // const isLoggedIn = !!localStorage.getItem('token'); // Check if the token exists
// Check if both token and user_id exist in localStorage
const isLoggedIn = !!localStorage.getItem('token') && !!localStorage.getItem('user_id');
const handleBrandClick = () => {
  if (isLoggedIn) {
    // If logged in, allow navigation to the home page
    navigate('/Home');
  } else {
    // Optionally, redirect to login or some other route if not logged in
    navigate('/');
  }
};
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
        <Container>
        <Navbar.Brand 
            style={{ cursor: 'pointer' }}
            onClick={handleBrandClick}
          >
            Book My <span style={{ color: "#00EE64", fontWeight: "bold" }}>Ground</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto text-light">
              {/* Conditionally render the Login/Logout button */}
             
              {/* Other links */}
              {isLoggedIn && (
                <>
                  <Nav.Link href="/createground" className='text-light'>Lets <span style={{ color: "#00EE64", fontWeight: "bold" }}>Register</span> <Gi3dGlasses size={30} /></Nav.Link>
                  <Nav.Link href="/adminDashboard" className='text-light'>Admin <span style={{ color: "#00EE64", fontWeight: "bold" }}>Dashboard</span> <MdOutlineAdminPanelSettings size={30}/></Nav.Link>
                </>
              )}
              {isLoggedIn ? (
                <Nav.Link onClick={handleLogout} className='text-light' style={{ cursor: 'pointer' }}>Log<span style={{ color: "#00EE64", fontWeight: "bold" }}>out</span><CiLogout size={30}/></Nav.Link>
              ) : (
                <Nav.Link href="/login" className='text-light'>Log<span style={{ color: "#00EE64", fontWeight: "bold" }}>In</span><CiLogin size={30}/></Nav.Link>
              )}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
