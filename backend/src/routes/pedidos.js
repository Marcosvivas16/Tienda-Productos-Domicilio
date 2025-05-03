import { Router } from "express";
import { PedidoController } from "../controllers/pedidos.js";

export const createPedidoRouter = ({ pedidoModel }) => {
    const pedidosRouter = Router();

    const pedidoController = new PedidoController({ pedidoModel });

    // Obtener todos los pedidos (solo admin o para pruebas)
    pedidosRouter.get("/", pedidoController.getAll);

    // Crear un nuevo pedido
    pedidosRouter.post("/", pedidoController.create);

    // Obtener pedidos por ID de usuario (para mostrar historial)
    pedidosRouter.get("/usuario/:id", pedidoController.getByUsuario);

    return pedidosRouter;
};