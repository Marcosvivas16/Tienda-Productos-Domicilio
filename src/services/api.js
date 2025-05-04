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
        imagen: item.url_imagen
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error al cargar el carrito:", error);
    return []; 
  }
};

export const saveCart = async (userId, token, item) => {
  try {
    // Validar que el item tenga productoId antes de enviarlo
    if (!item.productoId) {
      console.error("Error: Intentando guardar item sin productoId:", item);
      throw new Error("El productoId es obligatorio para guardar en el carrito");
    }
    
    console.log("Enviando al carrito:", item);
    
    const response = await fetch(`${API_BASE_URL}/carritos/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(item)
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
// Reemplazar la implementación actual de syncFullCart con esta versión
export const syncFullCart = async (userId, token, cartItems) => {
  try {
    console.log(`Sincronizando carrito para usuario ${userId} con ${cartItems.length} productos`);
    
    // Filtrar solo productos que tienen ID y mapear al formato correcto para la API
    const validCartItems = cartItems.filter(item => item.id);
    
    console.log("Productos válidos para sincronizar:", validCartItems);
    
    const addPromises = validCartItems.map(item => {
      return saveCart(userId, token, {
        productoId: item.id,
        cantidad: item.quantity || 1
      });
    });
    
    if (addPromises.length === 0) {
      console.log("No hay productos válidos para sincronizar");
      return true;
    }
    
    await Promise.all(addPromises);
    return true;
  } catch (error) {
    console.error("Error en syncFullCart:", error);
    throw error;
  }
};

// ---------------------- PEDIDOS ------------------------

export const guardarPedido = async (userId, cartItems, token) => {
  try {
    if (!userId || !token || !cartItems || cartItems.length === 0) {
      console.error("Se requieren datos de usuario, token y productos para crear un pedido");
      throw new Error("Datos de pedido incompletos");
    }

    // Formatear los datos EXACTAMENTE como espera el backend
    const pedidoData = {
      usuario_id: userId,
      productos: cartItems.map(item => ({
        id: item.id, // Cambiado de producto_id a id
        cantidad: item.quantity || 1
        // Eliminados precio y otros campos que no espera el backend
      }))
      // Eliminados campos direccion_entrega y estado que no espera el backend
    };

    console.log("Enviando pedido:", JSON.stringify(pedidoData, null, 2));

    const response = await fetch(`${API_BASE_URL}/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(pedidoData),
    });

    // Manejar respuesta no exitosa
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error ${response.status} al guardar pedido: ${errorText}`);
      throw new Error(`Error al guardar el pedido: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al guardar pedido:", error);
    throw error;
  }
};

export const obtenerPedidos = async (userId, token) => {
  try {
    if (!userId || !token) {
      console.error("Se requiere ID de usuario y token para obtener pedidos");
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/pedidos/usuario/${userId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    // Si no hay pedidos, devolver array vacío
    if (response.status === 404) {
      console.log("No se encontraron pedidos para el usuario");
      return [];
    }

    if (!response.ok) {
      console.error(`Error ${response.status} al obtener pedidos`);
      return [];
    }

    // Obtener los pedidos del servidor
    const pedidos = await response.json();
    
    // Verificar que sea un array
    if (!Array.isArray(pedidos)) {
      console.warn("Formato de respuesta inesperado para pedidos, no es un array:", pedidos);
      return [];
    }

    // Normalizar estructura para garantizar consistencia
    return pedidos.map(pedido => ({
      id: pedido.id || pedido._id || pedido.pedido_id || '',
      fecha: pedido.fecha || new Date().toISOString(),
      estado: pedido.estado || 'Pendiente',
      productos: Array.isArray(pedido.productos) ? pedido.productos : [],
      total: pedido.total || 0,
      usuario_id: pedido.usuario_id || userId
    }));
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    return [];
  }
};