import { Navbar, Nav, Container } from 'react-bootstrap';
import React from 'react';
import { Gi3dGlasses } from "react-icons/gi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { CiLogin, CiLogout,CiHome } from "react-icons/ci";

import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
   
    
    // Optionally, redirect the user to the login page
    navigate('/Logout');
  };

 // const isLoggedIn = !!localStorage.getItem('token'); // Check if the token exists
// Check if both token and user_id exist in localStorage
const isLoggedIn = !!localStorage.getItem('token') && !!localStorage.getItem('user_id');
const isSuperAdmin = localStorage.getItem("role") === "superadmin";

const handleBrandClick = () => {
  if (isLoggedIn) {
    // If logged in, allow navigation to the home page
    navigate('/');
  } else {
    // Optionally, redirect to login or some other route if not logged in
    navigate('/LoginForm');
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
            Pick Your <span style={{ color: "#00EE64" }}>Ground</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto text-light">
              {/* Conditionally render the Login/Logout button */}
              
              {/* Other links */}
              {/***it will check longin or not */}
              {isLoggedIn && (
                <>
                  <Nav.Link onClick={handleBrandClick} className='text-light' style={{ cursor: 'pointer' }}><span>Home</span><CiHome size={22} /></Nav.Link>
                  <Nav.Link href="/adminDashboard" className='text-light'>Admin <span style={{ color: "#00EE64" }}>Dashboard</span> <MdOutlineAdminPanelSettings size={22}/></Nav.Link>
                </>
              )}
              {/****it will check the superadmin or not */}
             {isSuperAdmin && (<Nav.Link href="/createground" className='text-light'>Lets <span style={{ color: "#00EE64" }}>Register</span> <Gi3dGlasses size={22} /></Nav.Link>)} 
              {isLoggedIn ? (
                <Nav.Link onClick={handleLogout} className='text-light' style={{ cursor: 'pointer' }}>Log<span style={{ color: "#00EE64" }}>out</span><CiLogout size={22}/></Nav.Link>
              ) : (
                <Nav.Link href="/LoginForm" className='text-light'>Log<span style={{ color: "#00EE64" }}>In</span><CiLogin size={22}/></Nav.Link>
              )}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
