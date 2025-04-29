import express, { json } from 'express'
import { productosRouter } from './routes/productos.js'
import { usuariosRouter } from './routes/usuarios.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()

app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by') 

app.use('/productos', productosRouter)
app.use('/usuarios', usuariosRouter)

export default app 