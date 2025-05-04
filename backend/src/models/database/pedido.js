import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}

const connection = await mysql.createConnection(config)

export class PedidoModel {
  static async getAll () {
    const [pedidos] = await connection.query(
      `SELECT id, BIN_TO_UUID(usuario_id) AS usuario_id, fecha, direccion, total FROM pedidos`
    )
    return pedidos
  }

  static async getById ({ id }) {
    const [pedidos] = await connection.query(
      `SELECT id, BIN_TO_UUID(usuario_id) AS usuario_id, fecha, direccion, total FROM pedidos WHERE id = ?;`,
      [id]
    )
    if (pedidos.length === 0) return null
    return pedidos[0]
  }

  static async getByUsuario ({ usuarioId }) {
    const [pedidos] = await connection.query(
      `SELECT id, BIN_TO_UUID(usuario_id) AS usuario_id, fecha, direccion, total
       FROM pedidos
       WHERE usuario_id = UUID_TO_BIN(?)
       ORDER BY fecha DESC`,
      [usuarioId]
    )
    return pedidos
  }

  static async create ({ input }) {
    const { usuario_id, direccion, productos } = input
    let total = 0

    for (const producto of productos) {
      const [result] = await connection.query(
        'SELECT precio FROM producto WHERE id = UUID_TO_BIN(?)',
        [producto.id]
      )

      if (result.length === 0) {
        throw new Error(`Producto con ID ${producto.id} no encontrado`)
      }

      const precioUnitario = result[0].precio
      total += precioUnitario * producto.cantidad
    }

    const fecha = new Date()

    const [result] = await connection.query(
      `INSERT INTO pedidos (usuario_id, fecha, direccion, total)
       VALUES (UUID_TO_BIN(?), ?, ?, ?);`,
      [usuario_id, fecha, direccion, total]
    )

    const pedidoId = result.insertId

    for (const producto of productos) {
      await connection.query(
        `INSERT INTO pedido_productos (pedido_id, producto_id, cantidad)
         VALUES (?, UUID_TO_BIN(?), ?);`,
        [pedidoId, producto.id, producto.cantidad]
      )
    }

    const [nuevoPedido] = await connection.query(
      `SELECT id, BIN_TO_UUID(usuario_id) AS usuario_id, fecha, direccion, total FROM pedidos WHERE id = ?;`,
      [pedidoId]
    )

    return nuevoPedido[0]
  }

  static async delete ({ id }) {
    const [result] = await connection.query(
      'DELETE FROM pedidos WHERE id = ?;',
      [id]
    )
    return result.affectedRows > 0
  }
}