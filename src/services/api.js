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
    console.log("Intentando iniciar sesión con:", email);
    const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // Verificar si la respuesta es correcta
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Credenciales incorrectas");
    }

    const data = await response.json();
    
    // Verificar que la respuesta tenga una estructura válida
    // Un token válido y un objeto usuario con un ID
    if (!data.token || !data.user || !data.user.id) {
      console.error("Estructura de respuesta inválida:", data);
      throw new Error("Estructura de autenticación incorrecta");
    }
    
    return data;
  } catch (error) {
    console.error("Error en iniciarSesion:", error);
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
    if (!userId) return [];
    
    console.log(`Obteniendo carrito para usuario: ${userId}`);
    
    const response = await fetch(`${API_BASE_URL}/carritos/${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    // Manejar mejor los códigos de respuesta
    if (response.status === 404) {
      console.log("No se encontró carrito para el usuario (nuevo usuario)");
      return []; // Carrito vacío
    }
    
    if (response.status === 401) {
      console.warn("Error de autorización al acceder al carrito");
      return []; // Error de autorización
    }
    
    if (!response.ok) {
      console.error(`Error al obtener carrito: ${response.status}`);
      return []; // En caso de error, devolver carrito vacío
    }
    
    const data = await response.json();
    console.log("Carrito obtenido de la API:", data);
    
    // Asegurar que siempre devolvemos un array de objetos con formato consistente
    if (Array.isArray(data)) {
      return data.map(item => ({
        id: item.productoId || item.producto_id,
        nombre: item.nombre || "Producto",
        precio: item.precio || 0,
        quantity: item.cantidad || 1,
        imagen: item.imagen || "/default-product.jpg"
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error al cargar el carrito:", error);
    return []; 
  }
};

// Modifica src/services/api.js - función saveCart
export const saveCart = async (userId, token, item) => {
  try {
    if (!userId || !token) {
      console.error("ID de usuario y token son necesarios para guardar el carrito");
      return;
    }
    
    // Formatear el objeto de la forma que espera la API
    const cartItem = {
      productoId: item.producto_id || item.id,
      cantidad: item.cantidad || item.quantity || 1
    };
    
    console.log("Enviando al carrito:", JSON.stringify(cartItem, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/carritos/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(cartItem),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error ${response.status} al guardar carrito: ${errorText}`);
      throw new Error("Error al guardar el carrito");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error al guardar el carrito:", error);
    throw error;
  }
};

// Función para eliminar un producto del carrito en el servidor
export const removeCartItem = async (userId, token, productoId) => {
  try {
    // Modificar esta URL: quitar "/producto" de la ruta
    const response = await fetch(`${API_BASE_URL}/carritos/${userId}/${productoId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.error(`Error ${response.status} al eliminar producto del carrito`);
      throw new Error("Error al eliminar producto del carrito");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error al eliminar del carrito:", error);
    throw error;
  }
};

// Función para sincronizar todo el carrito (purgar y recrear)
export const syncFullCart = async (userId, token, items) => {
  try {
    // Paso 1: Purgar el carrito actual
    await fetch(`${API_BASE_URL}/carritos/${userId}/purgar`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    // Paso 2: Si no hay items, terminamos aquí
    if (!items || items.length === 0) return;
    
    // Paso 3: Añadir cada producto al carrito
    for (const item of items) {
      await saveCart(userId, token, {
        producto_id: item.id,
        cantidad: item.quantity
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error al sincronizar el carrito:", error);
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