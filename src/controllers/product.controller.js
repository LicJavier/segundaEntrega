import logger from "../config/logger.config.js"
import { productosDao } from "../utils/index.js";
import ProductoFactory from "../classes/productos.factory.js";
const productFactory = new ProductoFactory(productosDao);

//----------------------------------------------------------------------------------------------
//---------------------------------PRODUCT CONTROLLERS------------------------------------------
//----------------------------------------------------------------------------------------------

export async function listarProductos( req , res ) {
    try {
        const productos = await productFactory.listarTodo();
        res.status(200).json(productos);
    } catch (error) {
        logger.error(error);
    }
}

export async function listarProducto( req , res ) {
    try {        
        let id = req.params.id;
        productId = await productFactory.listar(id);
        res.status(200).json(productId)
    } catch (error) {
        logger.error(error)
    }
}
export async function guardarProducto( req , res ) {
        try {        
            let objeto = req.body;
            let productoNuevo = await productFactory.guardar( objeto );
            res.status(201).json(productoNuevo);
        } catch (error) {
            logger.error(error)
        }
}

export async function actualizarProducto( req , res ) {
    try {
        const id = req.params.id;
        const body = req.body;
        let productId = await productFactory.actualizar( id , body );
        res.status(201).json(productId);
    } catch (error) {
        logger.error(error)
    }
}

export async function eliminarProducto( req , res ) {
    try {
        let id = req.params.id;
        let productId = await productFactory.eliminar( id );
        res.status(202).json( { "producto eliminado": productId } );  
    } catch (error) {
        logger.error(error)
    }
}