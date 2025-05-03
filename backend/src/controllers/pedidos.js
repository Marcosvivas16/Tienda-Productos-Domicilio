import { validatePedido } from '../schemes/pedidos.js'

export class PedidoController {
  constructor({ pedidoModel }) {
    this.pedidoModel = pedidoModel
  }

  getAll = async (req, res) => {
    const pedidos = await this.pedidoModel.getAll()
    res.json(pedidos)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const pedido = await this.pedidoModel.getById({ id })

    if (pedido) return res.json(pedido)
    res.status(404).json({ message: 'Pedido no encontrado' })
  }

  getByUsuario = async (req, res) => {
    const { id } = req.params
    const pedidos = await this.pedidoModel.getByUsuario({ usuarioId: id })
    res.json(pedidos)
  }

  create = async (req, res) => {
    const result = validatePedido(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const nuevoPedido = await this.pedidoModel.create({ input: result.data })

    res.status(201).json(nuevoPedido)
  }

  delete = async (req, res) => {
    const { id } = req.params

    const result = await this.pedidoModel.delete({ id })

    if (!result) {
      return res.status(404).json({ message: 'Pedido no encontrado' })
    }

    return res.json({ message: 'Pedido eliminado' })
  }
}