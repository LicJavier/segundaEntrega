import { generateHashPassword, usuarioDao } from "../../server.js";
import logger from "../config/logger.config.js"
import message from "../utils/nodemailer.js";
import CarritosDaoMemoria from "../models/daos/carritos/carritosDaoMemoria.js";
import ProductosDaoMongoDb from "../models/daos/productos/productosDaoMongoDb.js";
const productosDao = new ProductosDaoMongoDb;
const carritosDao = new CarritosDaoMemoria;
//----------------------------------------------------------------------------------------------
//---------------------------------CONTROLLERS--------------------------------------------------
//----------------------------------------------------------------------------------------------
export async function login( req , res ) {
    try {
        return res.render('login')
    } catch (error) {
        logger.error(error);
    }
}
export async function registro( req , res ) {
    try {
        return res.render('registro');
    } catch (error) {
        logger.error(error);
    }
}
let username = [];
let usermail = [];
export async function home( req , res ) {
    try {
        username = req.user.nombre;
    usermail = req.user.email;
    const usuario = req.user.email;
    const userAvatar = req.user.avatar;
    const producto = await productosDao.listarTodo();
    logger.info(producto);
    res.render('home', { usuario , producto  , userAvatar });
    } catch (error) {
        logger.error(error);
    }
}
export async function errorLogin(req , res){
    try {
        logger.error('Error en el Login')
        res.render('errorLogin');
    } catch (error) {
        logger.error(error);
    }
}
export async function errorRegister( req , res ){
    try {
        logger.error('Error en el Registro')
        res.render('errorRegister');
    } catch (error) {
        logger.error(error);
    }
}
export async function cart( req , res ){
    try {
        const usuario = req.user.email;
        const carrito = await carritosDao.listarTodo()
        logger.info(carrito)
        res.render('cart', { usuario , carrito });
    } catch (error) {
        logger.error(error);
    }
}
export async function registroSuccess( req , res ){
    try {
        res.render('registroSucces');
    } catch (error) {
        logger.error(error);
    }    
}

export async function deslogueo( req , res ){
    try {
        const usuario = req.user.nombre;
        req.logOut(err => {
            logger.info( "Deslogueo correcto" , usuario )
            res.render('deslogueo', { usuario } ) ;
        });
    } catch (error) {
        logger.error(error);
    }
}
export let productId = [];
export async function productID( req , res) {
    try {        
        let id = req.params.id;
        logger.info("este ID: " , id)
        productId = await productosDao.listarProducto(id);
        logger.info("este producto:" , productId);
        res.render( 'product' , { productId , id })   
    } catch (error) {
        logger.error(error)
    }
}
export async function any( req , res ) {
    try {
        logger.warn('Ruta desconocida', {ruta: req.params});
        res.send('Ruta Desconocida :/');
    } catch (error) {
        logger.error(error);
    }
}
export async function register( req , res ) {
    try {
        const { nombre , password , username , apellido , direccion , edad , telefono , avatar } = req.body;
        const admin = process.env.ACCOUNT_MAIL;
        const usuario = await usuarioDao.listarTodo();
        const newUsuario = usuario.find( e => e.username == username );
        if (newUsuario) {
            logger.warn('Usuario ya se registro')
            res.render('errorRegister');
        } else {
            const usuarioNuevo = await usuarioDao.guardar({ 
                nombre : nombre, 
                password : await generateHashPassword(password), 
                email : username,
                apellido : apellido,
                direccion : direccion,
                edad : edad,
                telefono : telefono,
                avatar: avatar
                }) 
            message( admin , username , nombre , apellido , direccion , edad , telefono )
            res.render('/registroSuccess');
        }
    } catch (error) {
        logger.error(error);
    }
}

export async function guardarProducto( req , res , next ) {
    const id = req.params.id;
    logger.info(id)
    const product = await productosDao.listarProducto(id);
    logger.info(product);
    const carrito = await carritosDao.guardar(product);
    next()
}