import express from 'express'
import { productosDao } from '../utils/index.js';
import logger from '../config/logger.config.js';
const routerProductos = express.Router();
//----------------------------------------------------------------------------------------------
//---------------------------------------DATA BASE----------------------------------------------
//----------------------------------------------------------------------------------------------

const administrador = true;

const usuario = function( req , res , next ){
    administrador ? next() : res.status( 401 ).json({ error: 401, descripción: "acceso no permitido, solo administradores" });
}

routerProductos.get('/',async ( req , res )=>{
    try {
        res.status(200).json(await productosDao.listarTodo());
    } catch (error) {
        logger.error(error)
    }
});

routerProductos.get( '/:id' , [ usuario ] , async ( req , res )=>{
    try {        
        let id = req.params.id;
        let productId = await productosDao.listar(id);
        res.status(200).json(productId);    
    } catch (error) {
        logger.error(error)
    }
});

routerProductos.post('/', [usuario] ,async ( req , res )=>{
    try {        
        let objeto = req.body;
        let productoNuevo = await productosDao.guardar( objeto );
        res.status(201).json({msg: "Producto agregado", data: productoNuevo , id: productoNuevo.id });
    } catch (error) {
        logger.error(error)
    }
});

routerProductos.put('/:id', [usuario] ,async ( req , res )=>{
    try {
        const id = req.params.id;
        const body = req.body;
        let productId = await productosDao.actualizar( id , body )
        res.status(201).json({ msg: "Producto modificado" , data : productId , id : id });
    } catch (error) {
        logger.error(error)
    }
});

routerProductos.delete('/:id', [usuario] ,async ( req , res )=>{
    try {
        let id = req.params.id;
        let productId = await productosDao.eliminar( id );
        res.status(202).json( { "producto eliminado": productId } );  
    } catch (error) {
        logger.error(error)
    }
});

export default routerProductos;