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
            'SELECT BIN_TO_UUID(id) AS id, email FROM usuario;'
        )
        return usuarios
    }

    static async register ({ input }) {
        const { email, password } = input

        const [lineas] = await connection.query('SELECT id FROM usuario WHERE email = ?', [email])
        if (lineas.length > 0) {
          throw new Error('El usuario ya existe.')
        }        

        const hashedPassword = await bcrypt.hash(password, 10)

        const [uuidResult] = await connection.query('SELECT UUID() uuid;')
        const [{ uuid }] = uuidResult    

        try {
            await connection.query(
                `INSERT INTO usuario (id, email, password)
                    VALUES (UUID_TO_BIN(?),?, ?);`,
                  [uuid, email, hashedPassword]
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
            email: usuarios[0].email
          };
        
	}
    
    static async login ({ input }) {
        const { email, password } = input

        const [[user]] = await connection.query(
            `SELECT BIN_TO_UUID(id) AS id, email, password FROM usuario WHERE email = ?`,
            [email]
        );

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;

        return {
            id: user.id,
            email: user.email
          };
        
    }

    static async protected({id}) {
        const [[user]] = await connection.query(
          `SELECT BIN_TO_UUID(id) AS id, email FROM usuario WHERE id = UUID_TO_BIN(?)`,
          [id]
        )      
        
        if (!user) return null

        return {
            id: user.id,
            email: user.email
          };
    }
}