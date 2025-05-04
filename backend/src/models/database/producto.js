/**
 * Proyecto Software
 * 2025
 * @author Diego Vallespin & Hatim Bajji
 */
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
};

const connection = await mysql.createConnection(config)

export class ProductoModel {
	static async getAll ({ categoria }) {
		if (categoria) {
			const lowerCaseCategoria = categoria.toLowerCase()
			const [categorias] = await connection.query(
				'SELECT id FROM categoria WHERE LOWER(nombre) = ?',  [lowerCaseCategoria]
			)
			
			if (categorias.length === 0) {
				return []
			}

			const [{id}] = categorias

			const [productos] = await connection.query(
				`SELECT BIN_TO_UUID(id) AS id, nombre, descripcion, precio, stock, url_imagen, categoria_id
				FROM producto
				WHERE categoria_id = ?;`,
				[id]
			)

			return productos
		}

		const [productos] = await connection.query(
				'SELECT BIN_TO_UUID(id) AS id, nombre, descripcion, precio, stock, url_imagen, categoria_id FROM producto;'
		)

		return productos
	}
    
	static async getById ({ id }) {
		const [productos] = await connection.query(
			`SELECT nombre, descripcion, precio, stock, url_imagen, BIN_TO_UUID(id) id
				FROM producto WHERE id = UUID_TO_BIN(?);`,
			[id]
		)

		if (productos.length === 0) return null
	
		return productos[0]
	}
    
	static async create ({ input }) {
		const { nombre, descripcion, precio, stock, url_imagen,categoria } = input

		const [categorias] = await connection.query(
			'SELECT id FROM categoria WHERE LOWER(nombre) = ?;',
			[categoria.toLowerCase()]
		)

		if (categorias.length === 0) {
			throw new Error('La categoría no existe')
		}

		const { id: categoria_id } = categorias[0]

		const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

		try {
			await connection.query(
			`INSERT INTO producto (id, nombre, descripcion, precio, stock, url_imagen, categoria_id)
				VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);`,
			  [uuid, nombre, descripcion, precio, stock, url_imagen, categoria_id]
    		)
    	} catch (e) {
      		throw new Error('Error creando el producto')
    	}

		const [productos] = await connection.query(
		`SELECT nombre, descripcion, precio, stock, url_imagen, categoria_id, BIN_TO_UUID(id) id
			FROM producto WHERE id = UUID_TO_BIN(?);`,
		  [uuid]
    	)

    	return productos[0]
	}
    
	static async delete ({ id }) {
		try {
			const [result] = await connection.query(
				'DELETE FROM producto WHERE id = UUID_TO_BIN(?);',
				[id]
			)

			return result.affectedRows > 0
		} catch (e) {
			throw new Error('Error eliminando el producto')
		}
	}
    
	static async update ({ id, input }) {
		const fields = []
		const values = []

		for (const key in input) {
			fields.push(`${key} = ?`)
			values.push(input[key])
		}

		if (fields.length === 0) {
			throw new Error('No se proporcionaron campos para actualizar')
		}

		try {
			await connection.query(
				`UPDATE producto
				 SET ${fields.join(', ')}
				 WHERE id = UUID_TO_BIN(?);`,
				[...values, id]
			)
		} catch (e) {
			throw new Error('Error actualizando el producto')
		}

		const productoActualizado = await this.getById({ id })
		return productoActualizado
	}

}