import { Router } from "express";
import { UsuarioController } from "../controllers/usuarios.js";
import { authenticateJWT } from "../middlewares/auth.js";


export const usuariosRouter = Router();

usuariosRouter.get("/", UsuarioController.getAll)

usuariosRouter.post("/login", UsuarioController.login)

usuariosRouter.post("/register", UsuarioController.register)

usuariosRouter.post("/logout", UsuarioController.logout)

usuariosRouter.get("/protected", authenticateJWT, UsuarioController.protected) 