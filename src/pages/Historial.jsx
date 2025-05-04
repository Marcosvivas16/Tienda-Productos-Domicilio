/**
 * Proyecto Software
 * 2025
 * @author Marcos Vivas
 */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { obtenerPedidos } from '../services/api';
import '../styles/Historial.css';

const Historial = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        if (currentUser && currentUser.id) {
          const token = localStorage.getItem('token');
          const data = await obtenerPedidos(currentUser.id, token);
          setPedidos(data);
        }
      } catch (err) {
        console.error("Error al cargar pedidos:", err);
        setError("No se pudieron cargar los pedidos");
      } finally {
        setLoading(false);
      }
    };

    cargarPedidos();
  }, [currentUser]);

  // Función segura para formatear el ID
  const formatearId = (id) => {
    if (!id) return "ID no disponible";
    if (typeof id === 'string') return id.substring(0, 8) + "...";
    return String(id).substring(0, 8) + "...";
  };

  // Función segura para formatear la fecha
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "Fecha no disponible";
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return fechaStr; // En caso de error, mostrar la cadena original
    }
  };

  if (loading) return <div className="loading-container">Cargando pedidos...</div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!pedidos || pedidos.length === 0) return <div className="empty-container">No tienes pedidos realizados</div>;

  return (
    <div className="historial-container">
      <h1>Historial de Pedidos</h1>
      <div className="pedidos-list">
        {pedidos.map((pedido) => (
          <div key={pedido.id || pedido._id || Math.random().toString()} className="pedido-card">
            <div className="pedido-header">
              <h3>Pedido: {pedido.id ? formatearId(pedido.id) : 'ID no disponible'}</h3>
              <span className="pedido-fecha">{formatearFecha(pedido.fecha)}</span>
            </div>
            <div className="pedido-estado">
              Estado: <span className={`estado ${pedido.estado?.toLowerCase()}`}>
                {pedido.estado || 'Procesando'}
              </span>
            </div>
            <div className="pedido-items">
              <h4>Productos:</h4>
              <ul>
                {Array.isArray(pedido.productos) ? (
                  pedido.productos.map((producto, index) => (
                    <li key={producto.id || index}>
                      {producto.nombre || 'Producto'} - Cantidad: {producto.cantidad}
                    </li>
                  ))
                ) : (
                  <li>Información de productos no disponible</li>
                )}
              </ul>
            </div>
            <div className="pedido-total">
              Total: €{parseFloat(pedido.total || 0).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Historial;