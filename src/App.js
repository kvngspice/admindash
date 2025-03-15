import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import config from "./config";

// Simple custom components to replace react-bootstrap
const Spinner = () => (
  <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', width: '24px', height: '24px', animation: 'spin 2s linear infinite' }}></div>
);

const Alert = ({ variant, children }) => (
  <div className={`alert alert-${variant}`}>{children}</div>
);

const Button = ({ variant, onClick, children, className }) => (
  <button className={`btn btn-${variant} ${className || ''}`} onClick={onClick}>{children}</button>
);

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Try the standard login endpoint first
      const response = await fetch(`${config.API_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password,
          role: 'admin' // Add role parameter
        })
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server returned non-JSON response: ${await response.text()}`);
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and set authenticated state
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUsername', data.username);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  const handleDemoLogin = () => {
    // For demo purposes only
    localStorage.setItem('adminToken', 'demo-token');
    localStorage.setItem('adminUsername', 'demo-admin');
    setIsAuthenticated(true);
  };

  if (loading && !isAuthenticated) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner />
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="card" style={{ width: '400px' }}>
          <div className="card-header bg-dark text-white text-center">
            <h4>Admin Dashboard Login</h4>
          </div>
          <div className="card-body">
            {error && <Alert variant="danger">{error}</Alert>}
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label>Username</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Password</label>
                <input 
                  type="password" 
                  className="form-control"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                />
              </div>
              <Button variant="primary" className="w-100">
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              
              <div className="mt-3 text-center">
                <p>For demonstration purposes:</p>
                <Button 
                  variant="secondary" 
                  onClick={handleDemoLogin}
                  className="mt-2"
                >
                  Demo Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="d-flex">
        {/* Sidebar Navigation */}
        <div className="d-flex flex-column p-4 bg-dark text-white" style={{ width: "280px", height: "100vh" }}>
          <h2 className="text-center mb-4">Admin Dashboard</h2>
          <nav className="flex-column">
            <Link to="/" className="text-white mb-2 p-2">Dashboard</Link>
            <Link to="/admin/campaigns" className="text-white mb-2 p-2">Manage Campaigns</Link>
            <Link to="/admin/add-influencer" className="text-white mb-2 p-2">Add Influencer</Link>
            <Link to="/admin/bookings" className="text-white mb-2 p-2">Manage Bookings</Link>
            <Link to="/admin/users" className="text-white mb-2 p-2">Manage Users</Link>
            <Link to="/admin/influencers" className="text-white mb-2 p-2">Manage Influencers</Link>
            <div className="mt-auto">
              <Button 
                variant="outline-light" 
                className="w-100 mt-4"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="container p-4">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/admin/campaigns" element={<div>Campaigns Management</div>} />
            <Route path="/admin/users" element={<div>User Management</div>} />
            <Route path="/admin/add-influencer" element={<div>Add Influencer</div>} />
            <Route path="/admin/bookings" element={<div>Bookings Management</div>} />
            <Route path="/admin/influencers" element={<div>Influencer Management</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
