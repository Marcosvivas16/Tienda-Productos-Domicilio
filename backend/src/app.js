import express, { json } from 'express'
import { productosRouter } from './routes/productos.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()

app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by') 

app.use('/productos', productosRouter)

export default app 