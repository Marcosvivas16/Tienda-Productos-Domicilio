/**
 * Proyecto Software
 * 2025
 * @author Diego Vallespin & Hatim Bajji
 */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

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

export class UsuarioModel {
    static async getAll () {
        const [usuarios] = await connection.query(
            'SELECT BIN_TO_UUID(id) AS id, email, nombre, telefono, direccion FROM usuario;'
        )
        return usuarios
    }

    static async getById ({ id }) {
		const [usuarios] = await connection.query(
			`SELECT BIN_TO_UUID(id) AS id, email, nombre, telefono, direccion
				FROM usuario WHERE id = UUID_TO_BIN(?);`,
			[id]
		)

		if (usuarios.length === 0) return null
	
		return usuarios[0]
	}

    static async register ({ input }) {
        const { email, password, nombre, telefono, direccion } = input

        const [lineas] = await connection.query('SELECT id FROM usuario WHERE email = ?', [email])
        if (lineas.length > 0) {
          throw new Error('El usuario ya existe.')
        }        

        const hashedPassword = await bcrypt.hash(password, 10)

        const [uuidResult] = await connection.query('SELECT UUID() uuid;')
        const [{ uuid }] = uuidResult    

        try {
            await connection.query(
                `INSERT INTO usuario (id, email, password, nombre, telefono, direccion)
                    VALUES (UUID_TO_BIN(?),?, ?, ?, ?, ?);`,
                  [uuid, email, hashedPassword, nombre, telefono, direccion]
            )
        } catch (e) {
            throw new Error('Error creando el usuario')
        }

		const [usuarios] = await connection.query(
		`SELECT email, BIN_TO_UUID(id) id FROM usuario WHERE id = UUID_TO_BIN(?);`,
		  [uuid]
    	)

        return {
            id: usuarios[0].id,
            email: usuarios[0].email,
            nombre: usuarios[0].nombre,
            telefono: usuarios[0].telefono,
            direccion: usuarios[0].direccion
          };
        
	}
    
    static async login ({ input }) {
        const { email, password } = input

        const [[user]] = await connection.query(
            `SELECT BIN_TO_UUID(id) AS id, email, password, nombre, telefono, direccion FROM usuario WHERE email = ?`,
            [email]
        );

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;

        return {
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            telefono: user.telefono,
            direccion: user.direccion
          };
        
    }

    static async update ({ id, input }) {
		const fields = []
		const values = []

        for (const key in input) {
            if (key === 'password') {
                const hashedPassword = await bcrypt.hash(input[key], 10)
                fields.push(`${key} = ?`)
                values.push(hashedPassword)
            } else {
                fields.push(`${key} = ?`)
                values.push(input[key])
            }
        }
    
		if (fields.length === 0) {
			throw new Error('No se proporcionaron campos para actualizar')
		}

		try {
			await connection.query(
				`UPDATE usuario
				 SET ${fields.join(', ')}
				 WHERE id = UUID_TO_BIN(?);`,
				[...values, id]
			)
		} catch (e) {
			throw new Error('Error actualizando el usuario')
		}

		const usuarioActualizado = await this.getById({ id })
		return usuarioActualizado
	}

    static async protected({id}) {
        const [[user]] = await connection.query(
          `SELECT BIN_TO_UUID(id) AS id, email, nombre, telefono, direccion FROM usuario WHERE id = UUID_TO_BIN(?)`,
          [id]
        )      
        
        if (!user) return null

        return {
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            telefono: user.telefono,
            direccion: user.direccion
          };
    }
}