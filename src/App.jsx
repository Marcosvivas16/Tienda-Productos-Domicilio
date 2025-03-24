import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Inicio from "./home/Inicio";
import Productos from "./home/Productos";
import Carrito from "./pages/Carrito";
import Perfil from "./pages/Perfil";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/carrito" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <Carrito />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/perfil" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <Perfil />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;