import express, { json } from 'express'
import cookieParser from 'cookie-parser'
import { createProductoRouter } from './routes/productos.js'
import { usuariosRouter } from './routes/usuarios.js'
import { corsMiddleware } from './middlewares/cors.js'

export const createApp = ({ productoModel }) => {
  const app = express()

  app.use(json())
  app.use(corsMiddleware())
  app.use(cookieParser())
  app.disable('x-powered-by') 

  app.use('/productos', createProductoRouter({ productoModel}))
  app.use('/usuarios', usuariosRouter)

  return app
}