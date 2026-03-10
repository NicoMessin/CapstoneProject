import "bootstrap/dist/css/bootstrap.min.css";
import "./css/App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Tickets from "./components/Tickets"
import Home from "./components/Home";
import Shop from "./components/Shop";
import UpperBar from "./components/UpperBar";
import FormLogin from "./components/FormLogin";
import FormRegister from "./components/FormRegister";
import Dashboard from "./components/Dashboard";
import Carrello from "./components/Carrello";






function App() {
  return (
    <BrowserRouter>

      {/* MOBILE fino a lg */}
      
       <UpperBar/>
     

     

      {/* PAGINE */}
      <Routes>

        <Route path="/carrelloItemsShop" element={<Carrello />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Home />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/auth/login" element={<FormLogin/>} />
        <Route path="/auth/register" element={<FormRegister/>} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;