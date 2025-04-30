import { UsuarioModel } from "../models/local-file-system/usuario.js";
//import { UsuarioModel } from '../models/database/usuario.js'
import { validateUsuario } from '../schemes/usuarios.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

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
      res.send({ id: nuevoUsuario.id })
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
      const token = jwt.sign(
        { user: usuario },
        process.env.JWT_SECRET,
        { expiresIn: '1d'}
      )

      const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        path: "/"
      }
      res
      .cookie("access_token",token,cookieOption)
      .send({ user: usuario, token })
    } catch (error) {
      res.status(401).json({ error: error.message })
    }
  }

  static async logout (req, res) {
    try {
      await UsuarioModel.logout()
      res
        .clearCookie("access_token")
        .status(200)
        .json({ message: "Sesión cerrada correctamente" })
    } catch (error) {
      res.status(500).json({ message: "Error al cerrar sesión", error: error.message })
    }
  }

  static async protected (req, res) {
    const { user } = req

    if (!user) {
      return res.status(403).json({ message: "Acceso no autorizado" })
    }

    try {
      const usuarioProtegido = await UsuarioModel.protected({ id: user.id })

      if (!usuarioProtegido) {
        return res.status(404).json({ message: "Usuario no encontrado" })
      }

      res.status(200).json(usuarioProtegido)
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" })
    }

  }
}