/**
 * Proyecto Software
 * 2025
 * @author Diego Vallespin & Hatim Bajji
 */
import { validatePedido } from '../schemes/pedidos.js'

export class PedidoController {
  constructor({ pedidoModel }) {
    this.pedidoModel = pedidoModel
  }

  getAll = async (req, res) => {
    try {
      const pedidos = await this.pedidoModel.getAll()
      res.json(pedidos)
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener pedidos', error })
    }
  }

  getById = async (req, res) => {
    try {
      const { id } = req.params
      const pedido = await this.pedidoModel.getById({ id })

      if (pedido) return res.json(pedido)
      res.status(404).json({ message: 'Pedido no encontrado' })
    } catch (error) {
      res.status(500).json({ message: 'Error al buscar el pedido', error })
    }
  }

  getByUsuario = async (req, res) => {
    try {
      const { id } = req.params
      const pedidos = await this.pedidoModel.getByUsuario({ usuarioId: id })
      res.json(pedidos)
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener pedidos del usuario', error })
    }
  }

  create = async (req, res) => {
    const result = validatePedido(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    try {
      const nuevoPedido = await this.pedidoModel.create({ input: result.data })
      res.status(201).json(nuevoPedido)
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el pedido', error })
    }
  }

  delete = async (req, res) => {
    try {
      const { id } = req.params
      const result = await this.pedidoModel.delete({ id })

      if (!result) {
        return res.status(404).json({ message: 'Pedido no encontrado' })
      }

      res.json({ message: 'Pedido eliminado' })
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el pedido', error })
    }
  }
}