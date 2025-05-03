import { randomUUID } from 'node:crypto'
import { readJSON, writeJSON, resolvePath } from '../../utils.js'

const FILE_CARRITOS = resolvePath('local-data/carritos.json')
const FILE_PRODUCTOS = resolvePath('local-data/productos.json')

export class CarritoModel {
  static async getByUsuario({ usuarioId }) {
    const carritos = await readJSON(FILE_CARRITOS)
    const productos = await readJSON(FILE_PRODUCTOS)
    const carrito = carritos.find(c => c.usuario_id === usuarioId)
    if (!carrito) return []

    return carrito.productos.map(item => {
      const producto = productos.find(p => p.id === item.producto_id)
      return {
        ...producto,
        quantity: item.quantity
      }
    })
  }

  static async addProducto({ usuarioId, input }) {
    const { productoId, cantidad } = input
    const carritos = await readJSON(FILE_CARRITOS)

    let carrito = carritos.find(c => c.usuario_id === usuarioId)
    if (!carrito) {
      carrito = { usuario_id: usuarioId, productos: [] }
      carritos.push(carrito)
    }

    const existente = carrito.productos.find(p => p.producto_id === productoId)
    if (existente) {
      existente.quantity += cantidad
    } else {
      carrito.productos.push({ producto_id: productoId, quantity: cantidad })
    }

    await writeJSON(FILE_CARRITOS, carritos)
    return await this.getByUsuario({ usuarioId })
  }

  static async updateCantidad({ usuarioId, productoId, cantidad }) {
    const carritos = await readJSON(FILE_CARRITOS)
    const carrito = carritos.find(c => c.usuario_id === usuarioId)
    if (!carrito) return null

    const producto = carrito.productos.find(p => p.producto_id === productoId)
    if (!producto) return null

    producto.quantity = cantidad
    await writeJSON(FILE_CARRITOS, carritos)
    return await this.getByUsuario({ usuarioId })
  }

  static async removeProducto({ usuarioId, productoId }) {
    const carritos = await readJSON(FILE_CARRITOS)
    const carrito = carritos.find(c => c.usuario_id === usuarioId)
    if (!carrito) return false

    const index = carrito.productos.findIndex(p => p.producto_id === productoId)
    if (index === -1) return false

    carrito.productos.splice(index, 1)
    await writeJSON(FILE_CARRITOS, carritos)
    return true
  }

  static async clear({ usuarioId }) {
    const carritos = await readJSON(FILE_CARRITOS)
    const index = carritos.findIndex(c => c.usuario_id === usuarioId)
    if (index !== -1) {
      carritos.splice(index, 1)
      await writeJSON(FILE_CARRITOS, carritos)
    }
  }
}