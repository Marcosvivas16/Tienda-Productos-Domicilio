import express, { json } from 'express'
import cookieParser from 'cookie-parser'
import { createProductoRouter } from './routes/productos.js'
import { createUsuarioRouter } from './routes/usuarios.js'
import { createCarritoRouter } from './routes/carritos.js'
import { createPedidoRouter } from './routes/pedidos.js' // NUEVO
import { corsMiddleware } from './middlewares/cors.js'

export const createApp = ({ productoModel, usuarioModel, carritoModel, pedidoModel }) => {
  const app = express()

  // Middlewares globales
  app.use(json())
  app.use(corsMiddleware())
  app.use(cookieParser())
  app.disable('x-powered-by')

  // Rutas principales del sistema
  app.use('/productos', createProductoRouter({ productoModel }))
  app.use('/usuarios', createUsuarioRouter({ usuarioModel }))
  app.use('/carritos', createCarritoRouter({ carritoModel }))
  app.use('/pedidos', createPedidoRouter({ pedidoModel })) // NUEVO

  return app
}