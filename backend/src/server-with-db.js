import { createApp } from './app.js'
import { ProductoModel } from './models/database/producto.js'

const app = createApp({ productoModel: ProductoModel })

const PORT = process.env.PORT ?? 1234

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})