import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Historial.css";

const Historial = () => {
  const { currentUser } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("todos");

  // Simular carga de datos de pedidos (reemplazar con llamada API real)
  useEffect(() => {
    // Función para cargar los pedidos
    const cargarPedidos = () => {
      setLoading(true);
      
      // Simula una llamada a API para obtener el historial de pedidos
      setTimeout(() => {
        // Datos de ejemplo - Reemplazar con datos reales de tu API
        const pedidosEjemplo = [
          {
            id: "P001",
            fecha: "2025-04-15",
            total: 45.90,
            estado: "entregado",
            items: [
              { id: 1, nombre: "Manzanas Rojas", cantidad: 2, precio: 1.2 },
              { id: 5, nombre: "Fresas", cantidad: 1, precio: 2.5 },
              { id: 7, nombre: "Tomates", cantidad: 3, precio: 1.2 }
            ],
            direccion: "Calle Ejemplo 123",
            metodoPago: "tarjeta"
          },
          {
            id: "P002",
            fecha: "2025-04-10",
            total: 32.75,
            estado: "entregado",
            items: [
              { id: 3, nombre: "Plátanos", cantidad: 1, precio: 0.99 },
              { id: 8, nombre: "Zanahorias", cantidad: 2, precio: 0.9 },
              { id: 11, nombre: "Queso Fresco", cantidad: 1, precio: 3.5 }
            ],
            direccion: "Calle Ejemplo 123",
            metodoPago: "efectivo"
          },
          {
            id: "P003",
            fecha: "2025-04-23",
            total: 27.80,
            estado: "en camino",
            items: [
              { id: 4, nombre: "Naranjas", cantidad: 3, precio: 1.3 },
              { id: 10, nombre: "Yogur Natural", cantidad: 2, precio: 2.2 }
            ],
            direccion: "Calle Ejemplo 123",
            metodoPago: "tarjeta"
          }
        ];
        
        setPedidos(pedidosEjemplo);
        setLoading(false);
      }, 1000);
    };
    
    cargarPedidos();
  }, [currentUser]);

  // Función para filtrar pedidos según el estado seleccionado
  const pedidosFiltrados = pedidos && pedidos.length > 0 
    ? (filtroEstado === "todos" 
        ? pedidos 
        : pedidos.filter(pedido => pedido.estado === filtroEstado))
    : [];

  return (
    <div className="historial-container">
      <div className="historial-header">
        <h1>Mis Pedidos</h1>
        <p>Revisa el estado de tus pedidos actuales y anteriores</p>
      </div>
      
      <div className="filtros-pedidos">
        <span>Filtrar por estado:</span>
        <div className="filtros-botones">
          <button 
            className={`filtro-btn ${filtroEstado === "todos" ? "active" : ""}`}
            onClick={() => setFiltroEstado("todos")}
          >
            Todos
          </button>
          <button 
            className={`filtro-btn ${filtroEstado === "en camino" ? "active" : ""}`}
            onClick={() => setFiltroEstado("en camino")}
          >
            En Camino
          </button>
          <button 
            className={`filtro-btn ${filtroEstado === "entregado" ? "active" : ""}`}
            onClick={() => setFiltroEstado("entregado")}
          >
            Entregados
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando tu historial de pedidos...</p>
        </div>
      ) : pedidosFiltrados && pedidosFiltrados.length > 0 ? (
        <div className="pedidos-list">
          {pedidosFiltrados.map((pedido) => (
            <div key={pedido.id} className="pedido-card">
              <div className="pedido-header">
                <div className="pedido-info">
                  <h3>Pedido #{pedido.id}</h3>
                  <p className="pedido-fecha">Fecha: {pedido.fecha}</p>
                </div>
                <div className="pedido-estado">
                  <span className={`estado-badge ${pedido.estado}`}>
                    {pedido.estado === "entregado" ? "Entregado" : "En Camino"}
                  </span>
                </div>
              </div>
              
              <div className="pedido-productos">
                {pedido.items && pedido.items.slice(0, 2).map((item) => (
                  <div key={item.id} className="pedido-producto">
                    <div className="producto-info">
                      <p className="producto-nombre">{item.nombre}</p>
                      <p className="producto-cantidad">Cantidad: {item.cantidad}</p>
                    </div>
                    <div className="producto-precio">
                      ${(item.precio * item.cantidad).toFixed(2)}
                    </div>
                  </div>
                ))}
                
                {pedido.items && pedido.items.length > 2 && (
                  <p className="mas-productos">
                    Y {pedido.items.length - 2} producto(s) más...
                  </p>
                )}
              </div>
              
              <div className="pedido-footer">
                <div className="pedido-total">
                  <p>Total: <strong>${pedido.total.toFixed(2)}</strong></p>
                </div>
                <Link 
                  to={`/historial/${pedido.id}`} 
                  className="btn-detalles"
                >
                  Ver Detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-pedidos">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/2037/2037381.png" 
            alt="No hay pedidos" 
            className="no-pedidos-img" 
          />
          <h3>No hay pedidos que mostrar</h3>
          <p>Aún no has realizado ningún pedido o no hay pedidos con el filtro seleccionado.</p>
          <Link to="/productos" className="btn-explorar">
            Explorar Productos
          </Link>
        </div>
      )}
    </div>
  );
};

export default Historial;