/**
 * Proyecto Software
 * 2025
 * @author Diego Vallespin & Hatim Bajji
 */
import { randomUUID } from 'node:crypto'
import { readJSON, writeJSON, resolvePath } from '../../utils.js'

const FILE_PRODUCTOS = resolvePath('local-data/productos.json')
const FILE_CATEGORIAS = resolvePath('local-data/categorias.json')

export class ProductoModel {
  static async getAll({ categoria }) {
    const productos = await readJSON(FILE_PRODUCTOS)
    if (!categoria) return productos

    const categorias = await readJSON(FILE_CATEGORIAS)
    const cat = categorias.find(c => c.nombre.toLowerCase() === categoria.toLowerCase())
    if (!cat) return []

    return productos.filter(p => p.categoria_id === cat.id)
  }

  static async getById({ id }) {
    const productos = await readJSON(FILE_PRODUCTOS)
    return productos.find(p => p.id === id)
  }

  static async create({ input }) {
    const productos = await readJSON(FILE_PRODUCTOS)
    const categorias = await readJSON(FILE_CATEGORIAS)

    const cat = categorias.find(c => c.nombre.toLowerCase() === input.categoria.toLowerCase())
    if (!cat) throw new Error('Categoría no encontrada')

    const nuevo = {
      id: randomUUID(),
      ...input,
      categoria_id: cat.id
    }

    productos.push(nuevo)
    await writeJSON(FILE_PRODUCTOS, productos)
    return nuevo
  }

  static async delete({ id }) {
    const productos = await readJSON(FILE_PRODUCTOS)
    const index = productos.findIndex(p => p.id === id)
    if (index === -1) return false

    productos.splice(index, 1)
    await writeJSON(FILE_PRODUCTOS, productos)
    return true
  }

  static async update({ id, input }) {
    const productos = await readJSON(FILE_PRODUCTOS)
    const index = productos.findIndex(p => p.id === id)
    if (index === -1) return false

    productos[index] = { ...productos[index], ...input }
    await writeJSON(FILE_PRODUCTOS, productos)
    return productos[index]
  }
}