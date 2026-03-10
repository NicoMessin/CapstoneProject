import { useEffect, useState } from "react"

function Carrello(){

cont [itemCarrello, setItemCarrello] = useState([])
useEffect(()=>{
fetch("http://localhost:3001/carrelloItemsShop")
.then((res)=>{
    if(!res.ok) {throw new Error("Errore nel recuper dell'item")}
    return res.json()
})
.then((data)=>{setItemCarrello(data)})
.catch((err)=>{console.error("Errore fetching item:", err)})

},[])
    return(
        <h1>CARRELLO</h1>

        {itemCarrello.map((item)=>(<div key={item.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <h3>{item.prodotto.name_product}</h3>
          <img src={item.prodotto.imageUrl} alt={item.prodotto.name_product} width={100} />
          <p>Prezzo unitario: €{item.prodotto.price}</p>

          {/* Taglia */}
          <select
            value={item.enumTaglia}
            onChange={(e) => aggiornaItem(item.id, item.quantita, e.target.value)}
          >
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>

          {/* Quantità */}
          <input
            type="number"
            value={item.quantita}
            min="1"
            onChange={(e) => aggiornaItem(item.id, parseInt(e.target.value), item.enumTaglia)}
          />

          <p>Totale: €{item.totale}</p>
        </div>
            
        ))}
    )
}
export default Carrello