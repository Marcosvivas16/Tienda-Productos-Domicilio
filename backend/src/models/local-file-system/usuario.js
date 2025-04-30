import { randomUUID } from 'node:crypto'
import { readJSON, writeJSON } from '../../utils.js'
import bcrypt from 'bcryptjs'

const usuarios = await readJSON('../local-data/usuarios.json')

export class UsuarioModel {
  static async getAll () {
    return usuarios.map(user => ({
      id: user.id,
			email: user.email
    }))
  }

  static async register ({ input }) {
    const { email, password } = input
    
    const existingUser = usuarios.find(user => user.email === email)
    if (existingUser) {
      throw new Error('El usuario ya existe.')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const nuevoUsuario = {
      id: randomUUID(),
			email,
      password: hashedPassword
    }

    usuarios.push(nuevoUsuario)
    await writeJSON('local-data/usuarios.json', usuarios) 

    return {
      id: nuevoUsuario.id,
			email: nuevoUsuario.email
    }
  }

  static async login ({ input }) {
    const { email, password } = input

    const user = usuarios.find(user => user.email === email)
    if (!user) {
      throw new Error('Usuario no encontrado.')
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      throw new Error('Contraseña incorrecta.')
    }

    return {
      id: user.id,
			email: user.email
    }
  }

	// El logout no hace nada porque estamos en local y no tenemos sesiones.
  static async logout () {
    // Devolvemos true para mantener una estructura coherente.
    return true
  }

  static async protected ({ id }) {
    const user = usuarios.find(user => user.id === id)
    if (!user) {
      return null
    }
    return {
      id: user.id,
			email: user.email
    }
  }
}