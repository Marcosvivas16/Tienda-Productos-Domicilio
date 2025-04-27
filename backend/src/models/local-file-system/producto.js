import { randomUUID } from 'node:crypto'
import { readJSON } from '../../utils.js'

const productos = await readJSON('../local-data/productos.json')
const categorias = await readJSON('../local-data/categorias.json')

export class ProductoModel {
	static async getAll ({ categoria }) {
		if (categoria) {
			const categoriaExistente = categorias.find(c => 
				c.nombre.toLowerCase() === categoria.toLowerCase()
			)
			if (!categoriaExistente) return false
			
			return productos.filter(
				producto => producto.categoria_id === categoriaExistente.id
			)
		}
	
		return productos
	}
      
	static async getById ({ id }) {
		const producto = productos.find(producto => producto.id === id)
		
		return producto	
	}
    
	static async create ({ input }) {
		const { categoria, ...restoInput } = input
	
		const categoriaExistente = categorias.find(c => 
			c.nombre.toLowerCase() === categoria.toLowerCase()
		)
	
		if (!categoriaExistente) {
			throw new Error('Categoría no encontrada')
		}
	
		const nuevoProducto = {
			id: randomUUID(),
			...restoInput,
			categoria_id: categoriaExistente.id
		}
	
		productos.push(nuevoProducto)
	
		return nuevoProducto
	}
	
    
	static async delete ({ id }) {
		const indiceProducto = productos.findIndex(producto => producto.id === id)

		if (indiceProducto === -1) {
			return false
		}

		productos.splice(indiceProducto, 1)

		return true        
	}
    
	static async update ({ id, input }) {
		const indiceProducto = productos.findIndex(producto => producto.id === id)
		if (indiceProducto === -1) {
			return false
		}

		productos[indiceProducto] = {
			...productos[indiceProducto],
			...input
		}
		return productos[indiceProducto]
	}
}