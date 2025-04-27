# README.md - API de Productos

## Descripción
La API de productos. Funciona actualmente con archivos JSON locales. Se añadirá pronto la conexión con MySQL.

## Instalación

```bash
çcd backend
npm install
node --watch src/server.js
```

El servidor estará disponible en `http://localhost:1234`.

## Datos
* Archivos en `local-data/` (productos.json y categorias.json)
* Los cambios solo se guardan en memoria

## Testing con api.http
1. Instalar extensión **REST Client** en VS Code
2. Abrir archivo `api.http`
3. Verás distintas peticiones (GET, POST, PUT, DELETE).
4. Hacer clic en "Send Request" para probar endpoints directamente

## Notas
* Los productos usan `categoria_id` relacionado con la lista de categorías
* Al crear productos o hacer cambios, debemos pasar la categoría como string. El sistema encuentra el ID automáticamente