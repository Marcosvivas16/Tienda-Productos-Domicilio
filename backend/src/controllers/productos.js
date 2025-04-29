//import { ProductoModel } from "../models/local-file-system/producto.js";
import { ProductoModel } from '../models/database/producto.js'
import { validateProducto, validatePartialProducto } from '../schemes/productos.js'

export class ProductoController {
  static async getAll (req, res) {
    const { categoria } = req.query
    const productos = await ProductoModel.getAll({ categoria })
    res.json(productos)
  }

  static async getById (req, res) {
    const { id } = req.params
    const producto = await ProductoModel.getById({ id })
    if (producto) return res.json(producto)
    res.status(404).json({ message: 'Producto no encontrado' })
  }

  static async create (req, res) {
    const result = validateProducto(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const nuevoProducto = await ProductoModel.create({ input: result.data })

    res.status(201).json(nuevoProducto)
  }

  static async delete (req, res) {
    const { id } = req.params

    const result = await ProductoModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    return res.json({ message: 'Producto borrado' })
  }

  static async update (req, res) {

    const result = validatePartialProducto(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const productoActualizado = await ProductoModel.update({ id, input: result.data })

    if (!productoActualizado) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    } 

    return res.json(productoActualizado)
  }
}