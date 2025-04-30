import { Router } from "express";
import { ProductoController } from "../controllers/productos.js";

export const createProductoRouter = ({ productoModel }) => {
    const productosRouter = Router();

    const productoController = new ProductoController({ productoModel });

    productosRouter.get("/", productoController.getAll)

    productosRouter.get("/:id", productoController.getById)

    productosRouter.post("/", productoController.create)

    productosRouter.delete("/:id", productoController.delete)

    productosRouter.patch("/:id", productoController.update)

    return productosRouter;
}