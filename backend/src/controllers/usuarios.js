import { validatePartialUsuario, validateRegistro, validateLogin } from '../schemes/usuarios.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export class UsuarioController {
  constructor ({ usuarioModel }) {
    this.usuarioModel = usuarioModel
  }

  getAll = async (req, res) => {
    const usuarios = await this.usuarioModel.getAll()
    res.json(usuarios)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const loggedUserId = req.user?.id
    
    if (loggedUserId !== id) {
      return res.status(403).json({ error: 'No tienes permiso para ver este usuario.' })
    }
  
    const usuario = await this.usuarioModel.getById({ id })
    if (usuario) return res.json(usuario)
    res.status(404).json({ message: 'Usuario no encontrado' })
  }

  register = async (req, res) => {
    const result = validateRegistro(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    try {
      const nuevoUsuario = await this.usuarioModel.register({ input: result.data })
      
      const token = jwt.sign(
        { user: nuevoUsuario },
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
      console.error('Error en registro:', error);
      res.status(400).json({ error: error.message })
    }
  }

  login = async (req, res) => {
    const result = validateLogin(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    try {
      const usuario = await this.usuarioModel.login({ input: result.data })

      if (!usuario) {
        return res.status(401).json({ error: "Credenciales incorrectas" });
      }

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

  logout = async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No hay sesión activa.' })
    }    

    try {
      res
        .clearCookie("access_token")
        .status(200)
        .json({ message: "Sesión cerrada correctamente" })
    } catch (error) {
      res.status(500).json({ message: "Error al cerrar sesión", error: error.message })
    }
  }
  
  update = async (req, res) => {
    const { id } = req.params
    const loggedUserId = req.user?.id
    if (loggedUserId !== id) {
      return res.status(403).json({ error: 'No tienes permiso para modificar este usuario.' })
    }    

    const result = validatePartialUsuario(req.body)
  
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    
    try {
      const usuarioActualizado = await this.usuarioModel.update({ id, input: result.data })
  
      if (!usuarioActualizado) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
  
      return res.json(usuarioActualizado)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }
  
  protected = async (req, res) => {
    const { user } = req

    if (!user) {
      return res.status(403).json({ message: "Acceso no autorizado" })
    }

    try {
      const usuarioProtegido = await this.usuarioModel.protected({ id: user.id })

      if (!usuarioProtegido) {
        return res.status(404).json({ message: "Usuario no encontrado" })
      }

      res.status(200).json(usuarioProtegido)
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" })
    }
  }
}