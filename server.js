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
// import moment from 'moment';
import * as dotenv from 'dotenv';
import compression from 'compression';
import routerProductos from './src/routes/productos.routes.js';
import routerCarrito from './src/routes/carritos.routes.js';
import process from 'process';
import routerRandoms from './src/routes/random.routes.js';
import logger from './src/config/logger.config.js';
// import cartAdminMessage from './src/utils/nodemailerAdmin.js';
// import cartUserMessage from './src/utils/nodemailerUser.js';
import whatsappMsj from './src/utils/twilio.js';
import routerPage from './src/routes/api.routes.js';
// import MensajesDaoFirebase from './src/models/daos/mensajes/mensajesDaoFirebase.js';
import UsuarioDaoMongoDb from './src/models/daos/usuariosDaoMongoDb.js';

export const usuarioDao = new UsuarioDaoMongoDb;
// const mensajesDao = new MensajesDaoFirebase;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// moment.locale('es');
// const hoy = moment();
dotenv.config();
export let DB_MENSAJES = [];
//----------------------------------------------------------------------------------------------
//-------------------------INSTANCIA DE SERVER--------------------------------------------------
//----------------------------------------------------------------------------------------------
export const app = express();
const httpServer = createServer(app);
//----------------------------------------------------------------------------------------------
//------------------------------MIDDLEWARES-----------------------------------------------------
//----------------------------------------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(morgan('tiny'));
app.use(compression({level:6}));

//----------------------------------------------------------------------------------------------
//-------------------------INSTANCIA DE SESSION-------------------------------------------------
//----------------------------------------------------------------------------------------------
import session from 'express-session';
import connectMongo from 'connect-mongo';
const advanceOptions = { useNewUrlParser: true , useUnifiedTopology: true }

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
//----------------------------------------------------------------------------------------------
//------------------------------PASSPORT-----------------------------------------------------
//----------------------------------------------------------------------------------------------
import {Strategy} from 'passport-local';
import passport from 'passport';
import bcrypt from 'bcrypt';
const LocalStrategy = Strategy;
app.use(passport.initialize());
app.use(passport.session());

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
//------------------------------AUTHENTICATION--------------------------------------------------
//----------------------------------------------------------------------------------------------

export async function generateHashPassword(params) {
    const passwordHash = await bcrypt.hash( params , 10 );
    return passwordHash;
}

async function verifyPass( username , password ) {
    const verificar = await bcrypt.compare( password , username.password );
    return verificar;
}

export async function auth(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.status(401).render('errorLogin')
}

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
app.use('/' , routerPage);

//----------------------------------------------------------------------------------------------
//---------------------------------------SERVIDOR-----------------------------------------------
//----------------------------------------------------------------------------------------------
const PORT = process.env.PORT || 8080;
const io = new Server(httpServer);
httpServer.listen( PORT , () => logger.info(`Escuchando en PUERTO: ${PORT} - PID WORKER ${process.pid}`));

io.on('connection', async (socket)=>{
    logger.info(`nuevo cliente conectado ${socket.id}`);
    
    // socket.on('add-cart', async (data)=>{
    //     const product = await productosDao.listar(data);
    //     await carritosDao.guardar(product);
    //     logger.info(product)
    // })

    socket.on( 'nueva-compra' , async (data) =>{
        logger.debug(data);
        const nombre = username;
        const email = usermail;
        whatsappMsj( nombre , email )
    })
    // socket.on( 'from-cliente-msj' , async ( data ) => {
    //     const newData = { ...data , hora: `${hoy.format( 'Do MMMM YYYY, h:mm:ss a' ) }` };
    //     await mensajesDao.guardar( newData )
    //     io.sockets.emit('from server msj', await mensajesDao.listarTodoNormalizado() );
    // })
}
)

// io.sockets.emit('los mensajes', await mensajesDao.listarTodoNormalizado());

io.sockets.on( 'nueva-compra' , async (data) =>{
    const { nombre , email } = user;
    // const admin = process.env.ACCOUNT_MAIL;
    // cartAdminMessage( admin , data , nombre , email );
    // cartUserMessage( email );
    await whatsappMsj( nombre , email );
})