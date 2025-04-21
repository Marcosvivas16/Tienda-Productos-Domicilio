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