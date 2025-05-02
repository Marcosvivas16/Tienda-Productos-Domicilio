# API de Productos, Usuarios y Carritos

## Descripción
Esta API permite gestionar productos, usuarios y los carritos de una tienda de productos a domicilio.

## Instalación
1. Navega al directorio del backend:
   ```bash
   cd backend
   ```

2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

3. Inicia el servidor **usando una de las siguientes opciones**:

   - Para iniciar con la base de datos:
     ```bash
     npm run start:db
     ```

   - Para iniciar en modo local:
     ```bash
     npm run start:local
     ```

El servidor estará disponible en **[http://155.210.71.196:1234](http://155.210.71.196:1234)**.

## Estructura de datos

- **Productos**:
        Archivos en `local-data/productos.json` y `local-data/categorias.json`
    
- **Usuarios**:
    Archivo en `local-data/usuarios.json`    

## Testing con api.http
1. Instalar extensión **REST Client** en VS Code
2. Abrir archivo `api.http`
3. Verás distintas peticiones (GET, POST, PUT, DELETE).
4. Hacer clic en "Send Request" para probar endpoints directamente

## Funcionalidades actuales

### Productos

- Obtener todos los productos (`GET /productos`)
- Obtener un producto por ID (`GET /productos/:id`)
- Filtrar productos por categoría (`GET /productos?categoria=nombre_categoria`)
- Crear un producto (`POST /productos`)
- Actualizar un producto (`PUT /productos/:id`)
- Eliminar un producto (`DELETE /productos/:id`)

Los productos utilizan categoria_id asociado a la lista de categorías. Para crear productos, se pasa la categoría como string y el sistema encuentra el ID correspondiente.

### Usuarios

- Obtener todos los usuarios (`GET /usuarios`)
- Obtener un usuario por ID (`GET /usuarios/:id`)
- Registrar un nuevo usuario (`POST /usuarios/register`)
- Login de usuario (`POST /usuarios/login`)
- Logout de usuario (`POST /usuarios/logout`)
- Actualizar un usuario (`PATCH /usuarios/update/:id`)
- Acceso a un endpoint protegido (`GET /usuarios/protected`)

Cada usuario tiene: email y contraseña.

### Carrito

- Obtener el carrito de un usuario (`GET /carritos/:usuarioId`)
- Añadir un producto al carrito (`POST /carritos/:usuarioId`)
- Actualizar la cantidad de un producto en el carrito (`PATCH /carritos/:usuarioId/:productoId`)
- Eliminar un producto del carrito (`DELETE /carritos/:usuarioId/:productoId`)
- Vaciar el carrito (`DELETE /carritos/:usuarioId`)

## Autenticación
La API utiliza autenticación basada en JWT (JSON Web Tokens). Aquí tienes un resumen de cómo funciona:

- **Login (`POST /usuarios/login`)**: Devuelve un token JWT que se almacena en una cookie llamada `access_token`.
- **Logout (`POST /usuarios/logout`)**: Elimina la cookie `access_token` para cerrar la sesión.
- **Endpoints protegidos**: Los endpoints protegidos requieren que el cliente envíe la cookie `access_token` en cada solicitud.

