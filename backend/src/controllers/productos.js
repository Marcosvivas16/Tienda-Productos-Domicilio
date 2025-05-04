/**
 * Proyecto Software
 * 2025
 * @author Diego Vallespin & Hatim Bajji
 */
import { validateProducto, validatePartialProducto } from '../schemes/productos.js'

export class ProductoController {
  constructor ({ productoModel }) {
    this.productoModel = productoModel
  }

  getAll = async (req, res) => {
    const { categoria } = req.query
    const productos = await this.productoModel.getAll({ categoria })
    res.json(productos)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const producto = await this.productoModel.getById({ id })
    if (producto) return res.json(producto)
    res.status(404).json({ message: 'Producto no encontrado' })
  }

  create = async (req, res) => {
    const result = validateProducto(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const nuevoProducto = await this.productoModel.create({ input: result.data })

    res.status(201).json(nuevoProducto)
  }

  delete = async (req, res) => {
    const { id } = req.params

    const result = await this.productoModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    return res.json({ message: 'Producto borrado' })
  }

  update = async (req, res) => {
    const result = validatePartialProducto(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const productoActualizado = await this.productoModel.update({ id, input: result.data })

    if (!productoActualizado) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    } 

    return res.json(productoActualizado)
  }
}