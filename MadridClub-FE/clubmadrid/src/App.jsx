import "bootstrap/dist/css/bootstrap.min.css";
import "./css/App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Tickets from "./components/Tickets"
import Home from "./components/Home";
import Shop from "./components/Shop";
import UpperBar from "./components/UpperBar";






function App() {
  return (
    <BrowserRouter>

      {/* MOBILE fino a lg */}
      
       <UpperBar/>
     

     

      {/* PAGINE */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;