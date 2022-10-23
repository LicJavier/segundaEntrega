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

dotenv.config();

const advanceOptions = { useNewUrlParser: true , useUnifiedTopology: true }

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
moment.locale('es')
const hoy = moment()
export let DB_MENSAJES = [];
const usuarioDB = [];
//----------------------------------------------------------------------------------------------
//-------------------------INSTANCIA DE SERVER--------------------------------------------------
//----------------------------------------------------------------------------------------------
const app = express();
const httpServer = createServer(app);

import routerProductos from './src/routes/productos.routes.js';
import routerCarrito from './src/routes/carritos.routes.js';
import MensajesDaoFirebase from './src/daos/mensajes/mensajesDaoFirebase.js';
import UsuarioDaoMongoDb from './src/daos/usuariosDaoMongoDb.js';
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


//----------------------------------------------------------------------------------------------
//---------------------------------MOTOR DE PLANTILLA-------------------------------------------
//----------------------------------------------------------------------------------------------
app.engine('hbs', expressHandlebars.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '/src/views/layouts'),
    partialsDir: path.join(__dirname, '/src/views/partials'),
    extname: 'hbs'
}));
app.set('views', path.join(__dirname, '/src/views'))
app.set('view engine', 'hbs')

//----------------------------------------------------------------------------------------------
//------------------------------RUTAS-----------------------------------------------------------
//----------------------------------------------------------------------------------------------
app.use('/api/productos', routerProductos);
app.use('/api/carrito', routerCarrito);

app.get('/', (req, res) => {
    res.render('login')
})

app.get( '/login' , ( req , res ) =>{
    res.render('login')
})

app.get('/api/productos-test', async ( req , res )=>{
    const producto = generarProducto();
    res.render('productos', {producto} );
});

app.get('/registro', (req, res) => {
    res.render('registro')
})

app.post('/login', passport.authenticate( 'local', { successRedirect : '/home' , failureRedirect : '/errorlogin'}));

app.post('/register', async (req,res)=>{
    const { username , password , mail } = req.body;

    const usuario = await usuarioDao.listarTodo()
    const newUsuario = usuario.find( e => e.nombre == username );
    if (newUsuario) {
        res.render('errorRegister')
    } else {
        const usuarioNuevo = await usuarioDao.guardar({ nombre : username , password : await generateHashPassword(password) , email : mail }) 
        res.redirect('/')
    }
})

app.get('/home', auth , async (req, res) => {
    const usuario = req.user.email;
    console.log(usuario)
    res.render('home', { usuario } )
})

app.get( '/errorlogin' , ( req , res ) => {
    res.render('errorlogin');
})

app.get('/deslogueo', async ( req , res )=>{
    const usuario = req.user.nombre;
    req.logOut(err => {
        res.render( 'deslogueo' , { usuario } ) ;
    });
});


//----------------------------------------------------------------------------------------------
//---------------------------------------SERVIDOR-----------------------------------------------
//----------------------------------------------------------------------------------------------
const PORT = dotenv.config().parsed.PORT;
const io = new Server(httpServer);
httpServer.listen( PORT , () => console.log(`escuchando en PUERTO: ${PORT}`));

io.on('connection', async (socket)=>{
    console.log(`nuevo cliente conectado ${socket.id}`);

    io.sockets.emit('los mensajes', await mensajesDao.listarTodoNormalizado())

    socket.on( 'from-cliente-msj' , async ( data ) => {
        const newData = { ...data , hora: `${hoy.format( 'Do MMMM YYYY, h:mm:ss a' ) }` };
        await mensajesDao.guardar( newData )
        io.sockets.emit('from server msj', await mensajesDao.listarTodoNormalizado() );
    })
})