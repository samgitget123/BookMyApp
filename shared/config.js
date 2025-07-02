const endpoints = {
  production: {
    baseUrl: "https://pickyourground.com",  // production endpoint
  },
  development: {
    baseUrl: "https://pickyourground.com",  // development endpoint
  },
};

const ENV = process.env.NODE_ENV || "development"; // Default to production
console.log("Using environment:", ENV);
console.log("API Base URL:", endpoints[ENV].baseUrl);
export default endpoints[ENV];
