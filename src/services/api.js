// Servicio simulado para la autenticación

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

  // Datos de ejemplo para productos
const productosData = [
  {
    id: 1,
    nombre: "Manzanas Rojas",
    precio: 1.2,
    precioAnterior: 1.5,
    imagen: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    descripcion: "Manzanas rojas frescas y jugosas, perfectas para comer directamente o usar en postres.",
    oferta: true,
    categoria: "frutas"
  },
  {
    id: 2,
    nombre: "Peras",
    precio: 1.5,
    imagen: "https://images.pexels.com/photos/568471/pexels-photo-568471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    descripcion: "Peras dulces y refrescantes, ricas en fibra y vitaminas.",
    categoria: "frutas"
  },
  {
    id: 3,
    nombre: "Plátanos",
    precio: 0.99,
    imagen: "https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    descripcion: "Plátanos amarillos en su punto perfecto de maduración, ideales para el desayuno o como snack.",
    categoria: "frutas"
  },
  {
    id: 4,
    nombre: "Naranjas",
    precio: 1.3,
    imagen: "https://images.pexels.com/photos/42059/citrus-diet-fiber-fresh-42059.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    descripcion: "Naranjas jugosas y llenas de vitamina C, perfectas para hacer zumo natural.",
    categoria: "frutas"
  },
  {
    id: 5,
    nombre: "Fresas",
    precio: 2.5,
    precioAnterior: 3.0,
    imagen: "https://images.pexels.com/photos/46174/strawberries-berries-fruit-freshness-46174.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    descripcion: "Fresas frescas y dulces, recién cosechadas y listas para disfrutar.",
    oferta: true,
    categoria: "frutas"
  },
  {
    id: 6,
    nombre: "Lechuga",
    precio: 0.8,
    imagen: "https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    descripcion: "Lechuga fresca y crujiente, perfecta para ensaladas saludables.",
    categoria: "verduras"
  },
  {
    id: 7,
    nombre: "Tomates",
    precio: 1.2,
    imagen: "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    descripcion: "Tomates rojos y jugosos, ideales para ensaladas o salsas caseras.",
    categoria: "verduras"
  },
  {
    id: 8,
    nombre: "Zanahorias",
    precio: 0.9,
    imagen: "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    descripcion: "Zanahorias frescas y crujientes, llenas de vitaminas y sabor.",
    categoria: "verduras"
  }
];

// Función para obtener todos los productos
export const obtenerProductos = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(productosData);
    }, 500); // Simula retraso de red
  });
};

// Función para obtener productos por categoría
export const obtenerProductosPorCategoria = (categoria) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const productosFiltrados = categoria === "todos" 
        ? productosData 
        : productosData.filter(p => p.categoria === categoria);
      resolve(productosFiltrados);
    }, 500);
  });
};

// Función para obtener un producto específico por ID
export const obtenerProductoPorId = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const producto = productosData.find(p => p.id === parseInt(id));
      if (producto) {
        resolve(producto);
      } else {
        reject(new Error("Producto no encontrado"));
      }
    }, 500);
  });
};