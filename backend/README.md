# README.md - API de Productos

## Descripción
Esta API permite gestionar productos y usuarios de una tienda de productos a domicilio.
Actualmente los datos se manejan en archivos JSON locales.
En el futuro se añadirá conexión a MySQL.

## Instalación

```bash
cd backend
npm install
node --watch src/server.js
```

El servidor estará disponible en `http://localhost:1234`.

## Estructura de datos

- **Productos**:
        Archivos en `local-data/productos.json` y `local-data/categorias.json`
    
- **Usuarios**:
    Archivo en `local-data/usuarios.json`    

Nota: Los cambios (crear, actualizar, eliminar) se guardan solo en memoria, no se escriben de vuelta a los archivos.

## Testing con api.http
1. Instalar extensión **REST Client** en VS Code
2. Abrir archivo `api.http`
3. Verás distintas peticiones (GET, POST, PUT, DELETE).
4. Hacer clic en "Send Request" para probar endpoints directamente

## Funcionalidades actuales

### Productos

- Obtener todos los productos.
- Obtener un producto por ID.
- Filtrar productos por categoría.
- Crear un producto.
- Actualizar un producto.
- Eliminar un producto.

Los productos utilizan categoria_id asociado a la lista de categorías. Para crear productos, se pasa la categoría como string y el sistema encuentra el ID correspondiente.

### Usuarios

- Obtener todos los usuarios (`GET /usuarios`)
- Registrar un nuevo usuario (`POST /usuarios/register`)
- Login de usuario (`POST /usuarios/login`)

Cada usuario tiene: email y contraseña.