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
const mensajesDao = new MensajesDaoFirebase();
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
app.get('/api/productos-test', async ( req , res )=>{
    const producto = generarProducto();
    res.render('productos', {producto} );
})
app.get('/', async ( req , res )=>{
    res.render( 'home');
})

//----------------------------------------------------------------------------------------------
//---------------------------------------SERVIDOR-----------------------------------------------
//----------------------------------------------------------------------------------------------
const PORT = 8080;
const io = new Server(httpServer);
httpServer.listen(PORT, () => console.log(`escuchando en ${PORT}`));

io.on('connection', async (socket)=>{
    console.log(`nuevo cliente conectado ${socket.id}`);

    io.sockets.emit('los mensajes', await mensajesDao.listarTodoNormalizado())

    socket.on( 'from-cliente-msj' , async ( data ) => {
        const newData = { ...data , hora: `${hoy.format( 'Do MMMM YYYY, h:mm:ss a' ) }` };
        await mensajesDao.guardar( newData )
        io.sockets.emit('from server msj', await mensajesDao.listarTodoNormalizado() );
    })
})