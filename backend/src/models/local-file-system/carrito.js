import { randomUUID } from 'node:crypto'
import { readJSON, writeJSON } from '../../utils.js'

const carritos = await readJSON('../local-data/carritos.json')
const productos = await readJSON('../local-data/productos.json')

export class CarritoModel {
  static async getByUsuario ({ usuarioId }) {
    const carrito = carritos.find(c => c.usuario_id === usuarioId)
    if (!carrito) return []

    // Enlazar productos
    return carrito.productos.map(item => {
      const producto = productos.find(p => p.id === item.producto_id)
      return {
        ...producto,
        quantity: item.quantity
      }
    })
  }

  static async addProducto ({ usuarioId, input }) {
    const { productoId, cantidad } = input

    let carrito = carritos.find(c => c.usuario_id === usuarioId)

    if (!carrito) {
      carrito = {
        usuario_id: usuarioId,
        productos: []
      }
      carritos.push(carrito)
    }

    const productoExistente = carrito.productos.find(p => p.producto_id === productoId)

    if (productoExistente) {
      productoExistente.quantity += cantidad
    } else {
      carrito.productos.push({ producto_id: productoId, quantity: cantidad })
    }

    await writeJSON('local-data/carritos.json', carritos)
    return await this.getByUsuario({ usuarioId })
  }

  static async updateCantidad ({ usuarioId, productoId, cantidad }) {
    const carrito = carritos.find(c => c.usuario_id === usuarioId)
    if (!carrito) return null

    const producto = carrito.productos.find(p => p.producto_id === productoId)
    if (!producto) return null

    producto.quantity = cantidad

    await writeJSON('local-data/carritos.json', carritos)
    return await this.getByUsuario({ usuarioId })
  }

  static async removeProducto ({ usuarioId, productoId }) {
    const carrito = carritos.find(c => c.usuario_id === usuarioId)
    if (!carrito) return false

    const index = carrito.productos.findIndex(p => p.producto_id === productoId)
    if (index === -1) return false

    carrito.productos.splice(index, 1)

    await writeJSON('local-data/carritos.json', carritos)
    return true
  }

  static async clear ({ usuarioId }) {
    const index = carritos.findIndex(c => c.usuario_id === usuarioId)
    if (index !== -1) {
      carritos.splice(index, 1)
      await writeJSON('local-data/carritos.json', carritos)
    }
  }
}