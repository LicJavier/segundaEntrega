import { Router } from "express"
import { listarTodo , listarProducto } from "../controllers/graphql.controller.js";

const graphRouter = Router();

graphRouter.get('/', listarTodo)
graphRouter.get('/:id', listarProducto)
// graphRouter.post('/', async (req,res)=>{
//     try {        
//         let objeto = req.body;
//         let productoNuevo = await productFactory.guardar( objeto );
//         res.status(201).json(productoNuevo);
//     } catch (error) {
//         logger.error(error)
//     }
// });
// graphRouter.put('/:id', async (req,res)=>{
//     try {
//         const id = req.params.id;
//         const body = req.body;
//         let productId = await productFactory.actualizar( id , body );
//         res.status(201).json(productId);
//     } catch (error) {
//         logger.error(error)
//     }
// });
// graphRouter.delete('/:id', async (req,res)=>{
//     try {
//         let id = req.params.id;
//         let productId = await productFactory.eliminar( id );
//         res.status(202).json( { "producto eliminado": productId } );  
//     } catch (error) {
//         logger.error(error)
//     }
// });

export default graphRouter;
