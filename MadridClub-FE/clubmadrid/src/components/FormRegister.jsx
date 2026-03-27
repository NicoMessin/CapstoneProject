import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";
import "../css/Form.css";

function FormRegister() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); 

    // controlli lato frontend
    if (!username.trim()) return setError("Username obbligatorio");
    if (!email.trim()) return setError("Email obbligatoria");
    if (!password.trim()) return setError("Password obbligatoria");
    if (password.length < 6) return setError("Password minimo 6 caratteri");
    if (!nome.trim()) return setError("Nome obbligatorio");
    if (!cognome.trim()) return setError("Cognome obbligatorio");

    const payload = { username, email, password, nome, cognome, tipoUtente: "USER" };

    fetch("http://localhost:3001/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
.then(({ status, body }) => {

  if (status !== 200 && status !== 201) {
    setError(body.message || "Errore nella registrazione");
    return;
  }

  alert("Registrazione effettuata! Ora puoi fare login.");
  localStorage.removeItem("token");
  navigate("/auth/login");

})
    .catch(err => setError("Errore nella registrazione: " + err.message));
  };

  return (
    <div className="d-flex justify-content-center align-items-start pt-5 bg-light divFormRegister" >
      <Form onSubmit={handleSubmit} className="p-4 rounded-4 shadow-sm bg-white" style={{ width: "100%", maxWidth: "450px" }}>
        <h3 className="text-center mb-4">Registrazione</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control value={username} onChange={e => setUsername(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nome</Form.Label>
          <Form.Control value={nome} onChange={e => setNome(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Cognome</Form.Label>
          <Form.Control value={cognome} onChange={e => setCognome(e.target.value)} />
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100">Registrati</Button>
      </Form>
    </div>
  );
}

export default FormRegister;