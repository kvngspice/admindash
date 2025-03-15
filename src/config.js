const config = {
  API_URL: process.env.REACT_APP_API_URL || 'https://influencer-backend-fmh5.onrender.com'
};

// Remove trailing slashes to prevent double slash issues
if (config.API_URL.endsWith('/')) {
  config.API_URL = config.API_URL.slice(0, -1);
}

console.log('Admin Dashboard - Current API URL:', config.API_URL);

export default config; 