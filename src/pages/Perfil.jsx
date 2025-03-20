import React from "react";
import "../styles/Perfil.css";

const Perfil = () => {
  return (
    <div className="container mt-4">
      <h2>Mi Perfil</h2>
      <div className="perfil-info">
        <p>Nombre: Usuario Ejemplo</p>
        <p>Email: usuario@ejemplo.com</p>
        <p>Dirección: Calle Ejemplo, 123</p>
        <button className="btn-primary">Editar Perfil</button>
      </div>
    </div>
  );
};

export default Perfil;