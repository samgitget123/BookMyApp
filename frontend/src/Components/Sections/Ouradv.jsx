import React from 'react';

const Ouradv = () => {
  return (
    <div className="our-adv-section py-3 ">
      <div className="container">
        <div className="row justify-content-center">
         
            <div className="card ">
              <div className="card-body text-center">
                <h2 className="display-6" style={{ color: '#006849' }}>Exciting Things Coming Soon!</h2>
                <p className="lead" style={{ color: '#333' }}>
                  We are working hard on upgrading our platform, and soon we'll be launching a more powerful version, including mobile apps for easier access!
                </p>
                <p className="mb-4" style={{ color: '#006849' }}>
                  Your continued support means the world to us. Stay tuned for our upcoming features and enhancements.
                </p>
                <a  className="btn btn-success btn-lg mt-3">
                  Stay Updated
                </a>
              </div>
            </div>
       
        </div>
      </div>
    </div>
  );
};

export default Ouradv;
