// src/services/api.js

// Importamos todos los módulos al inicio
import productosJSON from '../data/productos.json';

const API_BASE_URL = "http://localhost:1234";

// === Servicio para la autenticación y datos ===

// Usuarios de prueba
const usuariosDemo = [
  {
    id: "user1",
    nombre: "Usuario Demo",
    email: "usuario@ejemplo.com",
    password: "123456",
    isAuthenticated: true,
  },
];

// Obtener datos de un usuario por ID
export const obtenerUsuario = async (userId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const usuario = usuariosDemo.find(u => u.id === userId);
      if (usuario) {
        const { password, ...userData } = usuario;
        resolve(userData);
      } else {
        reject(new Error("Usuario no encontrado"));
      }
    }, 300);
  });
};

// Iniciar sesión
export const iniciarSesion = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const usuario = usuariosDemo.find(
        u => u.email === email && u.password === password
      );
      if (usuario) {
        const { password, ...userData } = usuario;
        resolve(userData);
      } else {
        reject(new Error("Credenciales incorrectas"));
      }
    }, 500);
  });
};

// Cerrar sesión
export const cerrarSesion = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 300);
  });
};

// === Productos y categorías ===

const categorias = {
  1: "frutas",
  2: "verduras",
  3: "lácteos",
  4: "panadería",
  5: "bebidas",
  6: "carne",
  7: "pescado",
  8: "congelados",
};

// Obtener nombre de categoría por ID
export const obtenerNombreCategoria = (categoriaId) => {
  return categorias[categoriaId] || "otros";
};

// Obtener ID de categoría por nombre
export const obtenerIdCategoria = (categoriaNombre) => {
  if (categoriaNombre === "todos") return 0;
  for (const [id, nombre] of Object.entries(categorias)) {
    if (nombre === categoriaNombre.toLowerCase()) {
      return parseInt(id);
    }
  }
  return 9; // otros
};

// Adaptar estructura del producto para frontend
const adaptarProductoParaFrontend = (producto) => {
  return {
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    imagen: producto.url_imagen || "https://via.placeholder.com/300",
    descripcion: producto.descripcion,
    categoria: obtenerNombreCategoria(producto.categoria_id),
    categoria_id: producto.categoria_id,
    stock: producto.stock,
  };
};

// Obtener todos los productos
export const obtenerProductos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/productos`);
    if (!response.ok) throw new Error("Error al obtener productos");

    const productos = await response.json();
    return productos.map(adaptarProductoParaFrontend);
  } catch (error) {
    console.error("Error al cargar productos desde la API:", error);
    return productosJSON.map(adaptarProductoParaFrontend);
  }
};

// Obtener productos por categoría
export const obtenerProductosPorCategoria = async (categoria) => {
  try {
    const response = await fetch(`${API_BASE_URL}/productos?categoria=${encodeURIComponent(categoria)}`);
    if (!response.ok) throw new Error("Error al obtener productos por categoría");

    const productos = await response.json();
    return productos.map(adaptarProductoParaFrontend);
  } catch (error) {
    console.error("Error al cargar productos desde la API:", error);
    throw error;
  }
};

// Obtener producto por ID
export const obtenerProductoPorId = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const producto = productosJSON.find(p => p.id === id);
      if (producto) {
        resolve(adaptarProductoParaFrontend(producto));
      } else {
        reject(new Error("Producto no encontrado"));
      }
    }, 500);
  });
};

// Buscar productos
export const buscarProductos = async (terminoBusqueda) => {
  try {
    const productos = await obtenerProductos();
    return productos.filter(producto =>
      producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(terminoBusqueda.toLowerCase())
    );
  } catch (error) {
    console.error(`Error buscando productos con término "${terminoBusqueda}":`, error);
    throw error;
  }
};

// === Guardar pedido (nueva función) ===
export const guardarPedido = async (userId, productos) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Pedido guardado (simulado):", {
        usuario: userId,
        productos: productos,
        fecha: new Date().toISOString(),
        total: productos.reduce((t, p) => t + p.precio * p.quantity, 0).toFixed(2)
      });
      resolve({ success: true });
    }, 500);
  });

  // Si usas un backend real, sustituye lo anterior por:
  /*
  const response = await fetch(`${API_BASE_URL}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productos }),
  });
  if (!response.ok) throw new Error("Error al guardar el pedido");
  return await response.json();
  */
};