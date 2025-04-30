import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

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

export class CarritoModel {
  static async getByUsuario({ usuarioId }) {
    const [carrito] = await connection.query(
      `SELECT BIN_TO_UUID(c.usuario_id) AS usuario_id, 
              BIN_TO_UUID(c.producto_id) AS producto_id,
              c.cantidad,
              p.nombre,
              p.descripcion,
              p.precio,
              p.stock,
              p.url_imagen,
              p.categoria_id
       FROM carrito c
       JOIN producto p ON c.producto_id = p.id
       WHERE c.usuario_id = UUID_TO_BIN(?);`,
      [usuarioId]
    )

    return carrito
  }

  static async addProducto({ usuarioId, input }) {
    const { productoId, cantidad } = input

    // Verificamos si ya existe el producto en el carrito
    const [[existe]] = await connection.query(
      `SELECT cantidad FROM carrito 
       WHERE usuario_id = UUID_TO_BIN(?) AND producto_id = UUID_TO_BIN(?);`,
      [usuarioId, productoId]
    )

    if (existe) {
      // Si ya existe, actualizamos la cantidad
      await connection.query(
        `UPDATE carrito SET cantidad = cantidad + ? 
         WHERE usuario_id = UUID_TO_BIN(?) AND producto_id = UUID_TO_BIN(?);`,
        [cantidad, usuarioId, productoId]
      )
    } else {
      // Si no existe, lo insertamos
      await connection.query(
        `INSERT INTO carrito (usuario_id, producto_id, cantidad)
         VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?);`,
        [usuarioId, productoId, cantidad]
      )
    }

    return await this.getByUsuario({ usuarioId })
  }

  static async updateCantidad({ usuarioId, productoId, cantidad }) {
    const [result] = await connection.query(
      `UPDATE carrito SET cantidad = ?
       WHERE usuario_id = UUID_TO_BIN(?) AND producto_id = UUID_TO_BIN(?);`,
      [cantidad, usuarioId, productoId]
    )

    if (result.affectedRows === 0) return null

    return await this.getByUsuario({ usuarioId })
  }

  static async removeProducto({ usuarioId, productoId }) {
    const [result] = await connection.query(
      `DELETE FROM carrito
       WHERE usuario_id = UUID_TO_BIN(?) AND producto_id = UUID_TO_BIN(?);`,
      [usuarioId, productoId]
    )

    return result.affectedRows > 0
  }

  static async clear({ usuarioId }) {
    await connection.query(
      `DELETE FROM carrito WHERE usuario_id = UUID_TO_BIN(?);`,
      [usuarioId]
    )
  }
}