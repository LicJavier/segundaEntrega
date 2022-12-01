//----------------------------------------------------------------------------------------------
//------------------------------------MODULOS---------------------------------------------------
//----------------------------------------------------------------------------------------------
import express from 'express';
import expressHandlebars from 'express-handlebars';
import morgan from 'morgan';
import path, { dirname } from 'path';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import generarProducto from './src/utils/faker.js';
import moment from 'moment';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import passport from 'passport';
import {Strategy} from 'passport-local';
const LocalStrategy = Strategy;
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import minimist from 'minimist';
import os from 'os';
import compression from 'compression';
const cpusCores = os.cpus().length;
const options ={ alias : { p : 'puerto' , g : 'gestor' } , default : { p : 8080 , g : 'FORK' } }
const mini = minimist( process.argv.slice(2) , options );
const modo = mini.g;
dotenv.config();

const advanceOptions = { useNewUrlParser: true , useUnifiedTopology: true }

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
moment.locale('es')
const hoy = moment()
export let DB_MENSAJES = [];
//----------------------------------------------------------------------------------------------
//-------------------------INSTANCIA DE SERVER--------------------------------------------------
//----------------------------------------------------------------------------------------------
const app = express();
const httpServer = createServer(app);

import routerProductos from './src/routes/productos.routes.js';
import routerCarrito from './src/routes/carritos.routes.js';
import MensajesDaoFirebase from './src/daos/mensajes/mensajesDaoFirebase.js';
import UsuarioDaoMongoDb from './src/daos/usuariosDaoMongoDb.js';
import process from 'process';
import routerRandoms from './src/routes/random.routes.js';
import logger from './src/utils/logger.config.js';
import message from './src/utils/nodemailer.js';
import ProductosDaoFirebase from './src/daos/productos/productosDaoFirebase.js';
const carritosDao = new CarritosDaoFirebase();
import CarritosDaoFirebase from './src/daos/carritos/carritosDaoFirebase.js';
const usuarioDao = new UsuarioDaoMongoDb();
const mensajesDao = new MensajesDaoFirebase();
const productosDao = new ProductosDaoFirebase();

//----------------------------------------------------------------------------------------------
//------------------------------PASSPORT-----------------------------------------------------
//----------------------------------------------------------------------------------------------

passport.use(new LocalStrategy(
    async function ( username, password , cb) {
        const usuario = await usuarioDao.listarTodo()
        const usuarioExistente = usuario.find( e => e.email == username )
        console.log(usuarioExistente)
        if ( !usuarioExistente ) {
            return cb( null , false )
        } else {
            const coincidir = await verifyPass( usuarioExistente , password );
            if ( !coincidir ) {
                return cb( null , false )
            } else {
                return cb( null , usuarioExistente );    
            }
        }
}));

passport.serializeUser(( usuario , cb ) => {
    cb( null , usuario );
})

passport.deserializeUser( async ( username , cb ) => {
    cb( null , username );
})

//----------------------------------------------------------------------------------------------
//-------------------------INSTANCIA DE SESSION-------------------------------------------------
//----------------------------------------------------------------------------------------------
const MongoStore = connectMongo.create({
    mongoUrl: process.env.MONGO_URL,
    mongoOptions: advanceOptions,
    ttl: 600
});

app.use(session({
    store: MongoStore,
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 600000
    }
}));

app.use(passport.initialize());
app.use(passport.session());
//----------------------------------------------------------------------------------------------
//------------------------------AUTHENTICATION--------------------------------------------------
//----------------------------------------------------------------------------------------------

async function generateHashPassword(params) {
    const passwordHash = await bcrypt.hash( params , 10 );
    return passwordHash;
}

async function verifyPass( username , password ) {
    const verificar = await bcrypt.compare( password , username.password );
    return verificar;
}

function auth(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.status(401).render('errorLogin')
}

//----------------------------------------------------------------------------------------------
//------------------------------MIDDLEWARES-----------------------------------------------------
//----------------------------------------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(morgan('tiny'));
app.use(compression({level:6}));
//----------------------------------------------------------------------------------------------
//---------------------------------MOTOR DE PLANTILLA-------------------------------------------
//----------------------------------------------------------------------------------------------
app.engine('hbs', expressHandlebars.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '/src/views/layouts'),
    partialsDir: path.join(__dirname, '/src/views/partials'),
    extname: 'hbs'
}));
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'hbs');

//----------------------------------------------------------------------------------------------
//------------------------------RUTAS-----------------------------------------------------------
//----------------------------------------------------------------------------------------------
app.use('/api/productos', routerProductos);
app.use('/api/carrito', routerCarrito);
app.use('/api/randoms', routerRandoms);

app.get('/', (req, res) => {
    res.render('login');
})

app.get( '/login' , ( req , res ) =>{
    res.render('login');
})
app.get('/datos' , (req , res) => {
    res.send(`Escuchando en PUERTO: ${PORT}`)
})

app.get('/info' , ( req , res ) => {
    const info = process;
    const cores = cpusCores;
    const argumentos = process.argv.slice(2).join(', ');
    logger.info( argumentos );
    res.render( 'info' , { info , argumentos , cores } );
})

app.get('/api/productos-test', async ( req , res )=>{
    const producto = generarProducto();
    res.render('productos', {producto} );
});

app.get('/registro', (req, res) => {
    res.render('registro');
})

app.post('/login', passport.authenticate( 'local', { successRedirect : '/home' , failureRedirect : '/errorlogin'}));

app.post('/register', async (req,res)=>{
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
        res.redirect('/');
    }
})
let username = [];
let usermail = [];
app.get('/home', auth , async (req, res) => {
    username = req.user.nombre;
    usermail = req.user.email;
    const usuario = req.user.email;
    const producto = await productosDao.listarTodo();
    const userAvatar = req.user.avatar;
    res.render('home', { usuario , producto , userAvatar });
})

app.get('/cart', auth , async (req, res) => {
    const usuario = req.user.email;
    const carrito = await carritosDao.listarTodo()
    res.render('cart', { usuario , carrito });
})

app.get( '/errorlogin' , ( req , res ) => {
    logger.error('Error en el Login')
    res.render('errorLogin');
})

app.get( '/registrosuccess' , ( req , res ) => {
    res.render('registroSucces');
})

app.get('/deslogueo', async ( req , res )=>{
    const usuario = req.user.nombre;
    req.logOut(err => {
        logger.info( "Deslogueo correcto" , usuario )
        res.render( 'deslogueo' , { usuario } ) ;
    });
});

app.get( '/:id' , auth , async ( req , res )=>{
    try {        
        let id = req.params.id;
        let productId = await productosDao.listar(id);
        console.log(productId)
        res.render( 'product' , { productId })   
    } catch (error) {
        console.log(error)
    }
});

app.get("*", (req,res)=>{
    logger.warn('Ruta desconocida', {ruta: req.params})
    res.send('Ruta Desconocida :/')
})

//----------------------------------------------------------------------------------------------
//---------------------------------------SERVIDOR-----------------------------------------------
//----------------------------------------------------------------------------------------------
const PORT = process.env.PORT || 8080;
const io = new Server(httpServer);
httpServer.listen( PORT , () => logger.info(`Escuchando en PUERTO: ${PORT} - PID WORKER ${process.pid}`));

io.on('connection', async (socket)=>{
    logger.info(`nuevo cliente conectado ${socket.id}`);
    
    socket.on('add-cart', async (data)=>{
        const product = await productosDao.listar(data);
        await carritosDao.guardar(product);
        logger.info(product)
    })

    socket.on( 'nueva-compra' , async (data) =>{
        logger.debug(data);
        const nombre = username;
        const email = usermail;
        whatsappMsj( nombre , email )
    })
    socket.on( 'from-cliente-msj' , async ( data ) => {
        const newData = { ...data , hora: `${hoy.format( 'Do MMMM YYYY, h:mm:ss a' ) }` };
        await mensajesDao.guardar( newData )
        io.sockets.emit('from server msj', await mensajesDao.listarTodoNormalizado() );
    })
}
)

io.sockets.emit('los mensajes', await mensajesDao.listarTodoNormalizado());


io.sockets.on( 'nueva-compra' , async (data) =>{
    logger.debug(data);
    const { nombre , email } = user;
    whatsappMsj( nombre , email )
})

import twilio from 'twilio';

const TWILIO_SID=process.env.TWILIO_SID;
const TWILIO_TOKEN= process.env.TWILIO_TOKEN;

const client = twilio( TWILIO_SID , TWILIO_TOKEN )

function whatsappMsj( nombre, mail ) {
    client.messages 
    .create({ 
        body:  `Nuevo pedido de ${nombre}, ${mail} `, 
        from: 'whatsapp:+14155238886',       
        to: 'whatsapp:+5491130474577' 
    }) 
    .then(message => console.log(message.sid)) 
    .done();
}

