import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";

function FormRegister() {
     const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      username,
      email,
      password,
      nome,
      cognome,
      tipoUtente: "USER" 
    };

    fetch("http://localhost:3001/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(res => {
  if (!res.ok) throw new Error("Errore nella registrazione");
  return res.json(); 
})
.then(data => {
  console.log(data); 
  alert("Registrazione effettuata! Ora puoi fare login.");

  // svuota qualsiasi utente loggato
  localStorage.removeItem("token");

  // naviga al login
  navigate('/auth/login'); window.location.reload(); 


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
      style={{ width: "100%", maxWidth: "450px" }}
    >
      <h3 className="text-center mb-4">Registrazione</h3>

      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </Form.Group>

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

      <Form.Group className="mb-3">
        <Form.Label>Nome</Form.Label>
        <Form.Control
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Cognome</Form.Label>
        <Form.Control
          value={cognome}
          onChange={(e) => setCognome(e.target.value)}
          required
        />
      </Form.Group>

      <Button type="submit" variant="primary" className="w-100">
        Registrati
      </Button>
    </Form>
  </div>
);
}

export default FormRegister;