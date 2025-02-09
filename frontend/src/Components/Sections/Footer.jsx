import React from 'react'
import {Container , Row , Col} from 'react-bootstrap';
const Footer = () => {
    const currentYear = new Date().getFullYear();


  return (
   <footer className='bg-dark'>
        <Container>
        <p className='text-light text-center py-2' style={{marginBottom: "0px"}}>Book My <span style={{color:"#00EE64" , fontWeight:"bold"}}>Ground</span> &copy; {currentYear}</p>
        </Container>
   </footer>
  )
}

export default Footer