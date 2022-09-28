import express from 'express'
import { productosDao } from '../index.js';
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
        console.log(error)
    }
});

routerProductos.get( '/:id' , [ usuario ] , async ( req , res )=>{
    try {        
        let id = req.params.id;
        let productId = await productosDao.listar(id);
        res.status(200).json(productId);    
    } catch (error) {
        console.log(error)
    }
});

routerProductos.post('/', [usuario] ,async ( req , res )=>{
    try {        
        let objeto = req.body;
        let productoNuevo = await productosDao.guardar( objeto );
        res.status(201).json({msg: "Producto agregado", data: productoNuevo , id: productoNuevo.id });
    } catch (error) {
        console.log(error)
    }
});

routerProductos.put('/:id', [usuario] ,async ( req , res )=>{
    try {
        const id = req.params.id;
        const body = req.body;
        let productId = await productosDao.actualizar( id , body )
        res.status(201).json({ msg: "Producto modificado" , data : productId , id : id });
    } catch (error) {
        console.log(error)
    }
});

routerProductos.delete('/:id', [usuario] ,async ( req , res )=>{
    try {
        let id = req.params.id;
        let productId = await productosDao.eliminar( id );
        res.status(202).json( { "producto eliminado": productId } );  
    } catch (error) {
        console.log(error)
    }
});

export default routerProductos;