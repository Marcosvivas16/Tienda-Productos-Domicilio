/**
 * Proyecto Software
 * 2025
 * @author Diego Vallespin & Hatim Bajji
 */
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { readJSON, writeJSON, resolvePath } from '../../utils.js'
import { fileURLToPath } from 'node:url'

// Solución robusta para obtener la ruta absoluta del archivo actual
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ruta completa y segura a pedidos.json
const FILE_PATH = resolvePath('local-data/pedidos.json')

export class PedidoModel {
  static async getAll () {
    const pedidos = await readJSON(FILE_PATH)
    return pedidos
  }

  static async getById ({ id }) {
    const pedidos = await readJSON(FILE_PATH)
    const pedido = pedidos.find(p => p.id === id)
    return pedido ?? null
  }

  static async getByUsuario ({ usuarioId }) {
    const pedidos = await readJSON(FILE_PATH)
    return pedidos
      .filter(p => p.usuario_id === usuarioId)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  }

  static async create ({ input }) {
    const pedidos = await readJSON(FILE_PATH)

    const nuevoPedido = {
      id: randomUUID(),
      usuario_id: input.usuario_id,
      fecha: new Date().toISOString(),
      estado: 'pendiente',
      total: input.productos.reduce((acc, p) => acc + p.precio * p.quantity, 0),
      productos: input.productos
    }

    pedidos.push(nuevoPedido)
    await writeJSON(FILE_PATH, pedidos)

    return nuevoPedido
  }

  static async delete ({ id }) {
    const pedidos = await readJSON(FILE_PATH)
    const index = pedidos.findIndex(p => p.id === id)
    if (index === -1) return false

    pedidos.splice(index, 1)
    await writeJSON(FILE_PATH, pedidos)

    return true
  }
}