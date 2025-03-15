import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Nav, Alert, Spinner, Form, Button, Card } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import config from "./config";

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
      const response = await fetch(`${config.API_URL}/api/auth/admin-login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

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

  // Login screen
  if (!isAuthenticated) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Card style={{ width: '400px' }} className="shadow">
          <Card.Header className="bg-dark text-white text-center">
            <h4>Admin Dashboard Login</h4>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                  type="text" 
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Router>
      <div className="d-flex">
        {/* Sidebar Navigation */}
        <div className="d-flex flex-column p-4 bg-dark text-white" style={{ width: "280px", height: "100vh" }}>
          <h2 className="text-center mb-4">Admin Dashboard</h2>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/" className="text-white">
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/campaigns" className="text-white">
              Campaigns
            </Nav.Link>
            <div className="mt-auto">
              <Button 
                variant="outline-light" 
                className="w-100 mt-4"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </Nav>
        </div>

        {/* Main Content */}
        <Container fluid className="p-4">
          <Routes>
            <Route path="/" element={<div>Dashboard Home</div>} />
            <Route path="/campaigns" element={<div>Campaigns List</div>} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
