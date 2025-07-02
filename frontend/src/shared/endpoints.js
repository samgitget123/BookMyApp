const endpoints = {
    development: {
      //baseUrl: "https://bookingapp-r0fo.onrender.com",  //https://bookingapp-r0fo.onrender.com/
    },
    production: {
      baseUrl: "https://pickyourground.com",  // Production endpoint
    },
  };
  
  const ENV = process.env.NODE_ENV || "production"; // Default to production
  console.log("Using environment:", ENV);
console.log("API Base URL:", endpoints[ENV].baseUrl);
  export default endpoints[ENV];
  