const endpoints = {
  production: {
    baseUrl: "https://bookingapp-r0fo.onrender.com",  // production endpoint
  },
  development: {
    baseUrl: "http://localhost:5000",  // development endpoint
  },
};

const ENV = process.env.NODE_ENV || "development"; // Default to production
console.log("Using environment:", ENV);
console.log("API Base URL:", endpoints[ENV].baseUrl);
export default endpoints[ENV];
