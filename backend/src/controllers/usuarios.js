import { UsuarioModel } from "../models/local-file-system/usuario.js";
//import { UsuarioModel } from '../models/database/usuario.js'
import { validateUsuario } from '../schemes/usuarios.js'

export class UsuarioController {
  static async getAll (req, res) {
    const usuarios = await UsuarioModel.getAll()
    res.json(usuarios)
  }

  static async register (req, res) {
    const result = validateUsuario(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    try {
      const nuevoUsuario = await UsuarioModel.register({ input: result.data })
      res.status(201).json(nuevoUsuario)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  static async login (req, res) {
    const result = validateUsuario(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    try {
      const usuario = await UsuarioModel.login({ input: result.data })
      res.status(200).json(usuario)
    } catch (error) {
      res.status(401).json({ error: error.message })
    }
  }

	// No validamos porque solo limpia la cookie de la sesión
  static async logout (req, res) {
    await UsuarioModel.logout()
    res.status(200).json({ message: "Sesión cerrada correctamente" })
  }

  static async protected (req, res) {
    const { user } = req.session

    if (!user) {
      return res.status(403).json({ message: "Acceso no autorizado" })
    }

    const usuarioProtegido = await UsuarioModel.protected({ id: user.id })

    if (!usuarioProtegido) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    res.status(200).json(usuarioProtegido)
  }
}