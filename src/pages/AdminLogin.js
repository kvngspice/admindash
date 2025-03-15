import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import config from "../config";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch(`${config.API_URL}/api/auth/token/`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.access);
      navigate("/admin"); // ✅ Redirect admin to the dashboard
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <Container className="mt-5">
      <h2>Admin Login</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Control type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        </Form.Group>
        <Button variant="primary" type="submit">Login</Button>
      </Form>
    </Container>
  );
};

export default AdminLogin;
