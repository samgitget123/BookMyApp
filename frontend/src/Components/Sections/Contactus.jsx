import React from 'react';

const Contactus = () => {
  return (
    <div className="contact-us-section py-3">
      <div className="container">
        <div className="row justify-content-center">
            <div className="card">
              <div className="card-body text-center">
                <h2 className='display-6' style={{ color: '#006849' }}>Contact Us</h2>
                <p className="lead" style={{ color: '#333' }}>
                  We would love to hear from you! Feel free to reach out to us using the details below:
                </p>
                
                {/* Office Address */}
                <div className="mb-3">
                  <h5 className="card-title" style={{ color: '#006849' }}>Our Office</h5>
                  <p style={{ color: '#333' }}>
                   Badangpet, Mallapur Road <br />
                    Hyd, India
                  </p>
                </div>

                {/* Contact Email */}
                <div className="mb-3">
                  <h5 className="card-title" style={{ color: '#006849' }}>Email</h5>
                  <p style={{ color: '#333' }}>
                    <a href="mailto:support@example.com" style={{ color: '#006849' }}>sampathgoudarukala@gmail.com</a>
                  </p>
                </div>

                {/* Phone Number */}
                <div className="mb-3">
                  <h5 className="card-title" style={{ color: '#006849' }}>Phone</h5>
                  <p style={{ color: '#333' }}>+919848851443</p>
                </div>

                {/* Social Media Links (Optional) */}
                <div>
                  {/* <a href="https://facebook.com" className="btn btn-outline-primary btn-sm m-2" target="_blank" rel="noopener noreferrer">Facebook</a>
                  <a href="https://twitter.com" className="btn btn-outline-info btn-sm m-2 " target="_blank" rel="noopener noreferrer">Twitter</a>
                  <a href="https://instagram.com" className="btn btn-outline-danger btn-sm m-2" target="_blank" rel="noopener noreferrer">Instagram</a> */}
                  <a href="https://wa.me/+919848851443" className="btn btn-outline-success btn-sm m-2" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Contactus;
