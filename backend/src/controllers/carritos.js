import { validateCarrito, validatePartialCarrito } from '../schemes/carritos.js'

export class CarritoController {
  constructor ({ carritoModel }) {
    this.carritoModel = carritoModel
  }

  getByUsuario = async (req, res) => {
    const { usuarioId } = req.params
    const carrito = await this.carritoModel.getByUsuario({ usuarioId })
    if (!carrito) {
      return res.status(404).json({ message: 'Carrito no encontrado' })
    }
    res.json(carrito)
  }

  addProducto = async (req, res) => {
    const { usuarioId } = req.params
    const result = validateCarrito(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    try {
      const carritoActualizado = await this.carritoModel.addProducto({ usuarioId, input: result.data })
      res.status(201).json(carritoActualizado)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  updateCantidad = async (req, res) => {
    const { usuarioId, productoId } = req.params
    const { cantidad } = req.body

    if (typeof cantidad !== 'number' || cantidad < 1) {
      return res.status(400).json({ error: 'Cantidad inválida' })
    }

    try {
      const actualizado = await this.carritoModel.updateCantidad({ usuarioId, productoId, cantidad })
      if (!actualizado) {
        return res.status(404).json({ message: 'Producto no encontrado en el carrito' })
      }
      res.json(actualizado)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  removeProducto = async (req, res) => {
    const { usuarioId, productoId } = req.params

    try {
      const eliminado = await this.carritoModel.removeProducto({ usuarioId, productoId })
      if (!eliminado) {
        return res.status(404).json({ message: 'Producto no encontrado en el carrito' })
      }
      res.json({ message: 'Producto eliminado del carrito' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  clear = async (req, res) => {
    const { usuarioId } = req.params

    try {
      await this.carritoModel.clear({ usuarioId })
      res.json({ message: 'Carrito vaciado correctamente' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}