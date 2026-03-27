import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";
import "../css/Form.css";

function FormLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); 

    fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(({ status, body }) => {

      if (status !== 200) {
        setError(body.message || "Email o password errate"); 
        return;
      }

      localStorage.setItem("token", body.accessToken);
      alert("Login effettuato!");
      navigate("/");

    })
    .catch(() => setError("Errore di connessione"));
  };

  return (
    <div className="d-flex justify-content-center align-items-start pt-5 bg-light divFormLogin" >
      <Form onSubmit={handleSubmit} className="p-4 rounded-4 shadow-sm bg-white FormLogin" >
        <h3 className="text-center mb-4">Login</h3>

        
        {error && <div className="alert alert-danger">{error}</div>}

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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