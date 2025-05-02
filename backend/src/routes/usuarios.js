import { Router } from "express";
import { UsuarioController } from "../controllers/usuarios.js";
import { authenticateJWT } from "../middlewares/auth.js";

export const createUsuarioRouter = ({ usuarioModel }) => {
    const usuariosRouter = Router();

    const usuarioController = new UsuarioController({ usuarioModel });

    usuariosRouter.get("/", usuarioController.getAll)

    usuariosRouter.get("/:id",  authenticateJWT, usuarioController.getById)

    usuariosRouter.post("/login", usuarioController.login)

    usuariosRouter.post("/register", usuarioController.register)

    usuariosRouter.post("/logout",  authenticateJWT,usuarioController.logout)

    usuariosRouter.update("/update/:id", authenticateJWT, usuarioController.update)

    usuariosRouter.get("/protected", authenticateJWT, usuarioController.protected) 

    return usuariosRouter;
}