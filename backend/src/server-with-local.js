import { createApp } from './app.js'
import { ProductoModel } from './models/local-file-system/producto.js'
import { UsuarioModel } from './models/local-file-system/usuario.js'
import { CarritoModel } from './models/local-file-system/carrito.js' // << AÑADIDO

const app = createApp({
  productoModel: ProductoModel,
  usuarioModel: UsuarioModel,
  carritoModel: CarritoModel // << AÑADIDO
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})