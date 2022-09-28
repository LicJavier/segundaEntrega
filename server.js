//----------------------------------------------------------------------------------------------
//------------------------------------MODULOS---------------------------------------------------
//----------------------------------------------------------------------------------------------
import express from 'express';


//----------------------------------------------------------------------------------------------
//-------------------------INSTANCIA DE SERVER--------------------------------------------------
//----------------------------------------------------------------------------------------------
const app = express();
import routerProductos from './src/routes/productos.routes.js';
import routerCarrito from './src/routes/carritos.routes.js';

//----------------------------------------------------------------------------------------------
//------------------------------MIDDLEWARES-----------------------------------------------------
//----------------------------------------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static( 'public' ));


//----------------------------------------------------------------------------------------------
//------------------------------RUTAS-----------------------------------------------------------
//----------------------------------------------------------------------------------------------
app.use('/api/productos', routerProductos);
app.use('/api/carrito', routerCarrito);

//----------------------------------------------------------------------------------------------
//---------------------------------------SERVIDOR-----------------------------------------------
//----------------------------------------------------------------------------------------------
const PORT = 8080;
const server = app.listen(PORT, ()=>{
    console.log(`escuchando en ${PORT}`)
})
server.on('error', error=>{
    console.error(`Error en el servidor${error}`);
});
