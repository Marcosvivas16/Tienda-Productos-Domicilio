// Importamos todos los módulos al inicio
import productosJSON from '../data/productos.json';
const API_BASE_URL = "http://155.210.71.196:1234";

// Servicio para la autenticación y datos

// Usuarios de prueba
const usuariosDemo = [
  {
    id: "user1",
    nombre: "Usuario Demo",
    email: "usuario@ejemplo.com",
    password: "123456",
    isAuthenticated: true
  }
];

// Obtener datos de un usuario por ID
export const obtenerUsuario = async (userId) => {
  // Simulamos una llamada a API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const usuario = usuariosDemo.find(u => u.id === userId);
      if (usuario) {
        // No devolver la contraseña al cliente
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
  // Simulamos una llamada a API de autenticación
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const usuario = usuariosDemo.find(
        u => u.email === email && u.password === password
      );
      
      if (usuario) {
        // No devolver la contraseña al cliente
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
  // Simulamos una llamada a API para cerrar sesión
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 300);
  });
};

// Mapa de categorías (para convertir entre ID y nombre)
const categorias = {
  1: "frutas",
  2: "verduras",
  3: "lácteos",
  4: "panadería",
  5: "bebidas",
  6: "carne",
  7: "pescado",
  8: "congelados"
};

// Función para obtener el nombre de categoría a partir del ID
export const obtenerNombreCategoria = (categoriaId) => {
  return categorias[categoriaId] || "otros";
};

// Función para obtener el ID de categoría a partir del nombre
export const obtenerIdCategoria = (categoriaNombre) => {
  if (categoriaNombre === "todos") return 0;

  for (const [id, nombre] of Object.entries(categorias)) {
    if (nombre === categoriaNombre.toLowerCase()) {
      return parseInt(id);
    }
  }
  return 9; // Categoría "otros" por defecto
};

// Adaptador para convertir la estructura del JSON a la estructura esperada por el frontend
const adaptarProductoParaFrontend = (producto) => {
  return {
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    // Usar directamente la URL de imagen del JSON
    imagen: producto.url_imagen || "https://via.placeholder.com/300",
    descripcion: producto.descripcion,
    // Convertir ID a nombre de categoría
    categoria: obtenerNombreCategoria(producto.categoria_id),
    categoria_id: producto.categoria_id,
    stock: producto.stock
  };
};

// Función para obtener todos los productos
export const obtenerProductos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/productos`);
    if (!response.ok) {
      throw new Error("Error al obtener productos");
    }
    const productos = await response.json();
    
    // Adaptar los productos antes de devolverlos, igual que en obtenerProductosPorCategoria
    const productosAdaptados = productos.map(adaptarProductoParaFrontend);
    return productosAdaptados;
  } catch (error) {
    console.error("Error al cargar productos desde la API:", error);
    
    // Si falla, devolver los productos del JSON local ya adaptados
    return productosJSON.map(adaptarProductoParaFrontend);
  }
};

export const obtenerProductosPorCategoria = async (categoria) => {
  try {
    const response = await fetch(`${API_BASE_URL}/productos?categoria=${encodeURIComponent(categoria)}`);
    if (!response.ok) {
      throw new Error("Error al obtener productos por categoría");
    }
    const productos = await response.json();
    
    const productosAdaptados = productos.map(adaptarProductoParaFrontend);
    return productosAdaptados;
  } catch (error) {
    console.error("Error al cargar productos desde la API:", error);
    throw error;
  }
};

// Función para obtener un producto específico por ID
export const obtenerProductoPorId = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const producto = productosJSON.find(p => p.id === id);
      if (producto) {
        // Adaptar el producto
        resolve(adaptarProductoParaFrontend(producto));
      } else {
        reject(new Error("Producto no encontrado"));
      }
    }, 500);
  });
};

// Función para buscar productos
export const buscarProductos = async (terminoBusqueda) => {
  try {
    // Obtener todos los productos y filtrar
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