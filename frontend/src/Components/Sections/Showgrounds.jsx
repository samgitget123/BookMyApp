



// Showgrounds.js
// src/components/Showgrounds.jsx
import React, { useEffect } from 'react';


import Cardcomponent from './Cardcomponent';
const Showgrounds = ({ selectedcity }) => {
  console.log(selectedcity,'selectedcity')
  return (
    <div className="container-fluid cardsection">
     
      <div>
           <Cardcomponent />
      </div>
    </div>
  );
};

export default Showgrounds;


