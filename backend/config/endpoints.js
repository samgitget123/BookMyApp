// config.js
const endpoints = {
 //production: "https://bookingapp-r0fo.onrender.com",  // Development endpoint
  development: "https://pickyourground.com/",                // Production endpoint
};

const ENV = process.env.NODE_ENV || "development"; // Default to production
const baseUrl = endpoints[ENV]; // Dynamically choose based on environment

console.log("Using environment:", ENV);
console.log("API Base URL:", baseUrl);

export default baseUrl;
