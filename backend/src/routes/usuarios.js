import { Router } from "express";
import { UsuarioController } from "../controllers/usuarios.js";

export const usuariosRouter = Router();

usuariosRouter.get("/", UsuarioController.getAll)

usuariosRouter.post("/login", UsuarioController.login)

usuariosRouter.post("/register", UsuarioController.register)

usuariosRouter.post("/logout", UsuarioController.logout)

// considerar cambiar nombre a /me o /profile
usuariosRouter.get("/protected", UsuarioController.protected) 