import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Inicio from "./home/Inicio";
import Productos from "./home/Productos";
import Carrito from "./pages/Carrito";
import Perfil from "./pages/Perfil";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/perfil" element={<Perfil />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;