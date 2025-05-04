/**
 * Proyecto Software
 * 2025
 * @author Diego Vallespin & Hatim Bajji
 */
import { Router } from "express";
import { CarritoController } from "../controllers/carritos.js";
import { authenticateJWT } from "../middlewares/auth.js";

export const createCarritoRouter = ({ carritoModel }) => {
  const carritosRouter = Router();

  const carritoController = new CarritoController({ carritoModel });

  // Obtener el carrito de un usuario
  carritosRouter.get("/:usuarioId", authenticateJWT, carritoController.getByUsuario);

  // Añadir producto al carrito
  carritosRouter.post("/:usuarioId", authenticateJWT, carritoController.addProducto);

  // Actualizar cantidad de un producto
  carritosRouter.patch("/:usuarioId/:productoId", authenticateJWT, carritoController.updateCantidad);

  // Eliminar un producto del carrito
  carritosRouter.delete("/:usuarioId/:productoId", authenticateJWT, carritoController.removeProducto);

  // Vaciar carrito
  carritosRouter.delete("/:usuarioId", authenticateJWT, carritoController.clear);

  return carritosRouter;
};