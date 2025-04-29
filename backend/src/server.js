import app from './app.js'

const PORT = process.env.PORT ?? 1234

app.listen(PORT, '0.0.0.0', () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})