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
const usuarioDao = new UsuarioDaoMongoDb();
const mensajesDao = new MensajesDaoFirebase();

//----------------------------------------------------------------------------------------------
//------------------------------PASSPORT-----------------------------------------------------
//----------------------------------------------------------------------------------------------

passport.use(new LocalStrategy(
    async function ( username, password , cb) {
        const usuario = await usuarioDao.listarTodo()
        const usuarioExistente = usuario.find( e => e.nombre == username )
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
    // console.log(argumentos)
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
    const { username , password , mail } = req.body;

    const usuario = await usuarioDao.listarTodo()
    const newUsuario = usuario.find( e => e.nombre == username );
    if (newUsuario) {
        logger.warn('Usuario ya se registro')
        res.render('errorRegister');
    } else {
        const usuarioNuevo = await usuarioDao.guardar({ nombre : username , password : await generateHashPassword(password) , email : mail }) 
        res.redirect('/');
    }
})

app.get('/home', auth , async (req, res) => {
    const usuario = req.user.email;
    res.render('home', { usuario } );
})

app.get( '/errorlogin' , ( req , res ) => {
    logger.error('Error en el Login')
    res.render('errorlogin');
})

app.get('/deslogueo', async ( req , res )=>{
    const usuario = req.user.nombre;
    req.logOut(err => {
        logger.info( "Deslogueo correcto" , usuario )
        res.render( 'deslogueo' , { usuario } ) ;
    });
});

app.get("*", (req,res)=>{
    logger.warn('Ruta desconocida', {ruta: req.params})
    res.send('Ruta Desconocida :/')
})

//----------------------------------------------------------------------------------------------
//---------------------------------------SERVIDOR-----------------------------------------------
//----------------------------------------------------------------------------------------------
const PORT = parseInt(process.argv[2]) || 8080;
const io = new Server(httpServer);
httpServer.listen( PORT , () => logger.info(`Escuchando en PUERTO: ${PORT} - PID WORKER ${process.pid}`));

io.on('connection', async (socket)=>{
    logger.info(`nuevo cliente conectado ${socket.id}`);
    

    socket.on( 'from-cliente-msj' , async ( data ) => {
        const newData = { ...data , hora: `${hoy.format( 'Do MMMM YYYY, h:mm:ss a' ) }` };
        await mensajesDao.guardar( newData )
        io.sockets.emit('from server msj', await mensajesDao.listarTodoNormalizado() );
    })
})

io.sockets.emit('los mensajes', await mensajesDao.listarTodoNormalizado());

//     }
// }
