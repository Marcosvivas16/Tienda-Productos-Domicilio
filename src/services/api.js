const API_BASE_URL = "http://155.210.71.196:1234";

// Categorías
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

// Adaptador producto
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

// ---------------------- USUARIOS ------------------------

export const iniciarSesion = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Credenciales incorrectas");

    return await response.json();
  } catch (error) {
    console.error("Error en inicio de sesión:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
      }
    });

    if (!response.ok) {
      throw new Error("Error al cerrar sesión");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error;
  }
};

export const obtenerUsuario = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/${userId}`);
    if (!response.ok) throw new Error("Usuario no encontrado");
    return await response.json();
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    throw error;
  }
};

// ---------------------- PRODUCTOS ------------------------

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

// ---------------------- CARRITO ------------------------

export const getCart = async (userId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/carritos/${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Error al obtener el carrito");
    return await response.json();
  } catch (error) {
    console.error("Error al cargar el carrito:", error);
    return [];
  }
};

export const saveCart = async (userId, items) => {
  try {
    if (!userId) {
      console.error("Error: Se está intentando guardar un carrito sin ID de usuario");
      return; // Terminar ejecución sin intentar la petición
    }
    
    const response = await fetch(`${API_BASE_URL}/carritos/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token') || ''}` 
      },
      body: JSON.stringify({ productos: items }),
    });

    if (!response.ok) {
      throw new Error("Error al guardar el carrito");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error al guardar el carrito:", error);
    throw error;
  }
};

// ---------------------- PEDIDOS ------------------------

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

    return await response.json();
  } catch (error) {
    console.error("Error al guardar pedido:", error);
    throw error;
  }
};

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