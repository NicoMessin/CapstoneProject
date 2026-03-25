
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";

function FormLogin() {
     const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    .then(res => {
      if (!res.ok) throw new Error("Email o password errate");
      return res.json();
    })
    .then(data => {
      localStorage.setItem("token", data.accessToken);
      alert("Login effettuato!");
        navigate("/"); window.location.reload(); 
    })
    .catch(err => alert(err.message));
  };

  return (
  <div
    className="d-flex justify-content-center align-items-start pt-5 bg-light"
    style={{ minHeight: "100vh", width: "100%" }}
  >
    <Form
      onSubmit={handleSubmit}
      className="p-4 rounded-4 shadow-sm bg-white"
      style={{ width: "100%", maxWidth: "400px" }}
    >
      <h3 className="text-center mb-4">Login</h3>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Inserisci email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Inserisci password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100">
        Accedi
      </Button>
    </Form>
  </div>
);
}

export default FormLogin;