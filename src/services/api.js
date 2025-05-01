// Importamos todos los módulos al inicio
import productosJSON from '../data/productos.json';
const API_BASE_URL = "http://155.210.71.196:1234";

// Función para iniciar sesión
export const iniciarSesion = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Credenciales incorrectas");
    }

    return await response.json(); // Devuelve el usuario autenticado
  } catch (error) {
    console.error("Error en inicio de sesión:", error);
    throw error;
  }
};

// Cerrar sesión (simulado localmente)
export const cerrarSesion = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 300);
  });
};

// Obtener datos de usuario por ID
export const obtenerUsuario = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/${userId}`);
    if (!response.ok) {
      throw new Error("Usuario no encontrado");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    throw error;
  }
};

// Categorías (puedes ampliarlas desde backend si quieres)
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

export const obtenerNombreCategoria = (categoriaId) => {
  return categorias[categoriaId] || "otros";
};

export const obtenerIdCategoria = (categoriaNombre) => {
  if (categoriaNombre === "todos") return 0;
  for (const [id, nombre] of Object.entries(categorias)) {
    if (nombre === categoriaNombre.toLowerCase()) {
      return parseInt(id);
    }
  }
  return 9;
};

// Adaptador de productos
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
    console.error("Error al cargar productos:", error);
    return [];
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
    console.error("Error al cargar productos por categoría:", error);
    throw error;
  }
};

// Obtener producto por ID
export const obtenerProductoPorId = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`);
    if (!response.ok) throw new Error("Producto no encontrado");
    const producto = await response.json();
    return adaptarProductoParaFrontend(producto);
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    throw error;
  }
};

// Buscar productos
export const buscarProductos = async (termino) => {
  try {
    const response = await fetch(`${API_BASE_URL}/productos?q=${encodeURIComponent(termino)}`);
    if (!response.ok) throw new Error("Error al buscar productos");
    const productos = await response.json();
    return productos.map(adaptarProductoParaFrontend);
  } catch (error) {
    console.error(`Error buscando productos con "${termino}":`, error);
    throw error;
  }
};

// Guardar pedido
export const guardarPedido = async (pedido) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pedido),
    });

    if (!response.ok) throw new Error("Error al guardar el pedido");

    return await response.json(); // Puede devolver { success: true } o el pedido creado
  } catch (error) {
    console.error("Error al guardar pedido:", error);
    throw error;
  }
};

// Obtener historial de pedidos por usuario
export const obtenerPedidos = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pedidos?userId=${userId}`);
    if (!response.ok) throw new Error("Error al obtener pedidos");
    return await response.json();
  } catch (error) {
    console.error("Error al cargar historial de pedidos:", error);
    return [];
  }
};