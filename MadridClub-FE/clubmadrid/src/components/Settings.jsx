import { useEffect, useState } from "react";

function Settings() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    email: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/auth/me", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setForm({
          nome: data.nome || "",
          cognome: data.cognome || "",
          email: data.email || "",
        });
      });
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    alert("Salvataggio simulato (qui colleghi il backend)");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>⚙️ Impostazioni</h1>

        <div style={styles.section}>
          <label>Nome</label>
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.section}>
          <label>Cognome</label>
          <input
            name="cognome"
            value={form.cognome}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.section}>
          <label>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <button style={styles.button} onClick={handleSave}>
          Salva modifiche
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f6fa",
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  section: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginTop: "5px",
  },
  button: {
    marginTop: "20px",
    padding: "10px",
    width: "100%",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Settings;