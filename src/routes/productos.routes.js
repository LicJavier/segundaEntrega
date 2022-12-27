import express from 'express'
import { actualizarProducto, eliminarProducto, guardarProducto, listarProducto, listarProductos } from '../controllers/product.controller.js';

const routerProductos = express.Router();

routerProductos.get('/', listarProductos);
routerProductos.get('/:id', listarProducto);
routerProductos.post('/', guardarProducto);
routerProductos.put('/:id', actualizarProducto);
routerProductos.delete('/:id', eliminarProducto);

export default routerProductos;