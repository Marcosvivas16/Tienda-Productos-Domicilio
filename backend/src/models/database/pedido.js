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
      `SELECT BIN_TO_UUID(id) AS id, usuario_id, fecha, estado, total
       FROM pedido`
    )
    return pedidos
  }

  static async getById ({ id }) {
    const [pedidos] = await connection.query(
      `SELECT BIN_TO_UUID(id) AS id, usuario_id, fecha, estado, total
       FROM pedido
       WHERE id = UUID_TO_BIN(?);`,
      [id]
    )
    if (pedidos.length === 0) return null
    return pedidos[0]
  }

  static async getByUsuario ({ usuarioId }) {
    const [pedidos] = await connection.query(
      `SELECT BIN_TO_UUID(id) AS id, usuario_id, fecha, estado, total
       FROM pedido
       WHERE usuario_id = ?
       ORDER BY fecha DESC`,
      [usuarioId]
    )
    return pedidos
  }

  static async create ({ input }) {
    const { usuario_id, productos } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    const total = productos.reduce((acc, p) => acc + p.precio * p.quantity, 0)

    const fecha = new Date()
    const estado = 'pendiente'

    await connection.query(
      `INSERT INTO pedido (id, usuario_id, fecha, estado, total)
       VALUES (UUID_TO_BIN(?), ?, ?, ?, ?);`,
      [uuid, usuario_id, fecha, estado, total]
    )

    for (const producto of productos) {
      await connection.query(
        `INSERT INTO pedido_producto (pedido_id, producto_id, cantidad)
         VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?);`,
        [uuid, producto.id, producto.quantity]
      )
    }

    const [nuevoPedido] = await connection.query(
      `SELECT BIN_TO_UUID(id) AS id, usuario_id, fecha, estado, total
       FROM pedido
       WHERE id = UUID_TO_BIN(?);`,
      [uuid]
    )

    return nuevoPedido[0]
  }

  static async delete ({ id }) {
    const [result] = await connection.query(
      'DELETE FROM pedido WHERE id = UUID_TO_BIN(?);',
      [id]
    )
    return result.affectedRows > 0
  }
}
