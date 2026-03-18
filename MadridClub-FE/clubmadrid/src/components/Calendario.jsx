import { useState, useEffect } from "react";


function Calendario() {
  const [dataCorrente, setDataCorrente] = useState(new Date());
  const [partite, setPartite] = useState([]);

  const mese = dataCorrente.getMonth();
  const anno = dataCorrente.getFullYear();

  useEffect(() => {
    fetch(`http://localhost:3001/partite`)
      .then(res => res.json())
      .then(data => setPartite(data))
      .catch(err => console.error(err));
  }, [mese, anno]);

  const firstDay = new Date(anno, mese, 1).getDay();
  const daysInMonth = new Date(anno, mese + 1, 0).getDate();

  const calendario = [];
  let giorno = 1;
  for (let i = 0; i < 42; i++) {
    if (i < firstDay || giorno > daysInMonth) {
      calendario.push(null);
    } else {
      const dataStr = `${anno}-${String(mese + 1).padStart(2,"0")}-${String(giorno).padStart(2,"0")}`;
      const partiteGiorno = partite.filter(p => p.data === dataStr);
      calendario.push({ giorno, partite: partiteGiorno });
      giorno++;
    }
  }

  function mesePrecedente() { setDataCorrente(new Date(anno, mese - 1)); }
  function meseSuccessivo() { setDataCorrente(new Date(anno, mese + 1)); }

  const mesi = [
    "Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno",
    "Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"
  ];

  
  // Divido in righe di 7 celle
  const righe = [];
  for (let i = 0; i < calendario.length; i += 7) {
    righe.push(calendario.slice(i, i + 7));
  }

  return (
    <div className="container my-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-primary" onClick={mesePrecedente}>◀</button>
        <h2>{mesi[mese]} {anno}</h2>
        <button className="btn btn-primary" onClick={meseSuccessivo}>▶</button>
      </div>

      {/* Giorni settimana */}
      <div className="row text-center fw-bold d-none d-sm-flex">
        {["Dom","Lun","Mar","Mer","Gio","Ven","Sab"].map(d => (
          <div key={d} className="col border py-1">{d}</div>
        ))}
      </div>

      {/* Celle calendario */}
      {righe.map((riga, i) => (
        <div key={i} className="row">
          {riga.map((cella, j) => (
            <div key={j} className="col border p-2" style={{minHeight: "80px"}}>
              {cella && (
                <>
                  <div className="fw-bold">{cella.giorno}</div>
                  {cella.partite.map(p => (
                    <div key={p.id} className="bg-info text-white rounded px-1 my-1" style={{fontSize:"12px"}}>
                      {p.casa} vs {p.trasferta}
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Calendario;