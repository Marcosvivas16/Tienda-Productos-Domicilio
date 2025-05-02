import { createApp } from './app.js'
import { ProductoModel } from './models/database/producto.js'
import { UsuarioModel } from './models/database/usuario.js'
import { CarritoModel } from './models/database/carrito.js'
import { PedidoModel } from './models/database/pedido.js' // Nuevo

const app = createApp({
  productoModel: ProductoModel,
  usuarioModel: UsuarioModel,
  carritoModel: CarritoModel,
  pedidoModel: PedidoModel // Integración del modelo de pedidos
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})