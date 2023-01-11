import { Router } from "express"
import { listarTodo , listarProducto, eliminarProducto, guardarProducto, actualizarProducto } from "../controllers/graphql.controller.js";

const graphRouter = Router();

graphRouter.get('/', listarTodo)
graphRouter.post('/:id', listarProducto)
graphRouter.post('/', guardarProducto)
graphRouter.put('/:id', actualizarProducto)
graphRouter.delete('/:id', eliminarProducto);

export default graphRouter;
