import express from 'express'
import { carritosDao } from '../utils/index.js';
import logger from '../config/logger.config.js';
const routerCarrito = express.Router();

const administrador = true;


const usuario = function( req , res , next ){
    administrador ? next() : res.status(401).json({ error: 401, descripción: "acceso no permitido, solo administradores" });
}
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

routerCarrito.get('/',async ( req , res )=>{
    try {
        res.status(200).json(await carritosDao.listarTodo());
    } catch (error) {
        logger.warn(error)
    }
});

routerCarrito.get('/:id', [usuario], async ( req , res )=>{
    try {
        const id = req.params.id;
        const carritoId = await carritosDao.listar(id);
        res.status(200).json(carritoId)
    } catch (error) {
        logger.warn(error)
    }    
});

routerCarrito.post('/', [usuario] , async ( req , res )=>{
    try {
        const objeto = req.body;
        const productoEnCarrito = await carritosDao.guardar(objeto)
        res.status(201).json({ data: productoEnCarrito, id: productoEnCarrito._id });
    } catch (error) {
        logger.warn(error)
    }
});

routerCarrito.delete('/:id', [usuario] , async ( req , res )=>{
    try {
        const id = req.params.id;
        const carritoEliminable = await carritosDao.eliminar(id);
        res.status(202).json({ "producto eliminado" : carritoEliminable })
    } catch (error) {
        logger.warn(error)
    }
});

routerCarrito.put('/:id', [usuario] ,async ( req , res )=>{
    try {
        const id = req.params.id;
        console.log(req.body)
        const body = req.body;
        let productId = await carritosDao.actualizar( id , body )
        res.status(201).json({ msg: "Producto modificado" , data : productId , id : id });
    } catch (error) {
        logger.warn(error);
    }
})

export default routerCarrito;