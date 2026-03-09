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
  navigate('/')
})
    .catch(err => alert(err.message));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Username</Form.Label>
        <Form.Control value={username} onChange={e => setUsername(e.target.value)} required />
      </Form.Group>

      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </Form.Group>

      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </Form.Group>

      <Form.Group>
        <Form.Label>Nome</Form.Label>
        <Form.Control value={nome} onChange={e => setNome(e.target.value)} required />
      </Form.Group>

      <Form.Group>
        <Form.Label>Cognome</Form.Label>
        <Form.Control value={cognome} onChange={e => setCognome(e.target.value)} required />
      </Form.Group>

      <Button type="submit">Registrati</Button>
    </Form>
  );
}

export default FormRegister;