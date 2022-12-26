import { Router } from "express";
import passport from "passport";
import { deslogueo, any ,cart ,errorLogin, errorRegister, home, login, productID, register, registro, registroSuccess, guardarProducto } from "../controllers/page.controller.js";
import { auth } from "../../server.js";


const routerPage = Router();

routerPage.get('/', login);
routerPage.get('/login', login);
routerPage.get('/registro' , registro);
routerPage.get('/home' , auth ,home );
routerPage.get('/errorLogin' , errorLogin);
routerPage.get('/registroSucces' , registroSuccess);
routerPage.get('/errorRegister', errorRegister);
routerPage.get('/deslogueo', auth ,deslogueo);
routerPage.get('/cart', auth ,cart)
routerPage.get('/:id', auth , productID);
routerPage.get('/add/:id' , guardarProducto , cart)
routerPage.get('*' , any);

routerPage.post('/login', passport.authenticate( 'local' , { successRedirect : '/home' , failureRedirect : '/errorlogin' }))
routerPage.post('/register' , register)

export default routerPage;










