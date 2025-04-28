import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ListaProductos from "../components/ListaProductos";
import { obtenerProductos } from "../services/api";
import { useCart } from "../context/CartContext";
import "../styles/Productos.css";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState("todos");
  const [searchParams] = useSearchParams();
  const terminoBusqueda = searchParams.get("buscar") || "";
  const { addToCart } = useCart();

  useEffect(() => {
    const cargarProductos = async () => {
      setLoading(true);
      try {
        const data = await obtenerProductos();
        setProductosOriginales(data);
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  // Filtra productos cuando cambia la categoría o el término de búsqueda
useEffect(() => {
  if (productosOriginales.length > 0) {
    let productosFiltrados = productosOriginales;
    
    // Filtrar por categoría
    if (categoriaActiva !== "todos") {
      productosFiltrados = productosFiltrados.filter(
        p => p.categoria.toLowerCase() === categoriaActiva.toLowerCase()
      );
    }
    
    // Filtrar por término de búsqueda
    if (terminoBusqueda) {
      productosFiltrados = productosFiltrados.filter(
        p => p.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
           (p.descripcion && p.descripcion.toLowerCase().includes(terminoBusqueda.toLowerCase()))
      );
    }
    
    setProductos(productosFiltrados);
  }
}, [categoriaActiva, terminoBusqueda, productosOriginales]);

  const agregarAlCarrito = (producto) => {
    addToCart(producto);
  };

  const cambiarCategoria = (categoria) => {
    setCategoriaActiva(categoria);
  };

  return (
    <div className="productos-page">
      {terminoBusqueda && (
        <div className="resultados-busqueda">
          <h2>Resultados para: "{terminoBusqueda}"</h2>
          {productos.length === 0 && !loading && (
            <p className="no-resultados">No se encontraron productos que coincidan con tu búsqueda.</p>
          )}
        </div>
      )}
      
      <div className="banner-categorias">
        <h1>Productos Frescos</h1>
        <p>Las mejores selecciones entregadas a tu puerta</p>
      </div>
      
      <div className="filtros-rapidos">
        <button 
          className={`filtro-btn ${categoriaActiva === "todos" ? "active" : ""}`}
          onClick={() => cambiarCategoria("todos")}
        >
          Todos
        </button>
        <button 
          className={`filtro-btn ${categoriaActiva === "frutas" ? "active" : ""}`}
          onClick={() => cambiarCategoria("frutas")}
        >
          Frutas
        </button>
        <button 
          className={`filtro-btn ${categoriaActiva === "verduras" ? "active" : ""}`}
          onClick={() => cambiarCategoria("verduras")}
        >
          Verduras
        </button>
        <button 
          className={`filtro-btn ${categoriaActiva === "lacteos" ? "active" : ""}`}
          onClick={() => cambiarCategoria("lacteos")}
        >
          Lácteos
        </button>
        <button 
          className={`filtro-btn ${categoriaActiva === "panaderia" ? "active" : ""}`}
          onClick={() => cambiarCategoria("panaderia")}
        >
          Panadería
        </button>
        <button 
          className={`filtro-btn ${categoriaActiva === "bebidas" ? "active" : ""}`}
          onClick={() => cambiarCategoria("bebidas")}
        >
          Bebidas
        </button>
        <button 
          className={`filtro-btn ${categoriaActiva === "carne" ? "active" : ""}`}
          onClick={() => cambiarCategoria("carne")}
        >
          Carne
        </button>
        <button 
          className={`filtro-btn ${categoriaActiva === "pescado" ? "active" : ""}`}
          onClick={() => cambiarCategoria("pescado")}
        >
          Pescado
        </button>
        <button 
          className={`filtro-btn ${categoriaActiva === "congelados" ? "active" : ""}`}
          onClick={() => cambiarCategoria("congelados")}
        >
          Congelados
        </button>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando productos...</p>
        </div>
      ) : (
        <ListaProductos 
          productos={productos} 
          agregarAlCarrito={agregarAlCarrito} 
        />
      )}
    </div>
  );
};

export default Productos;