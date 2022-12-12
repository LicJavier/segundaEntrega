import CarritosDaoArchivo from "../models/daos/carritos/carritosDaoArchivos.js";
import CarritosDaoMemoria from "../models/daos/carritos/carritosDaoMemoria.js";
import ProductosDaoArchivo from "../models/daos/productos/productosDaoArchivo.js";
import ProductosDaoMemoria from "../models/daos/productos/productosDaoMemoria.js";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

dotenv.config()

export let productosDao;
export let carritosDao;

switch (dotenv.config().parsed.METODO) {
    case 'archivo':
        productosDao = new ProductosDaoArchivo();
        carritosDao = new CarritosDaoArchivo();
        break;
    case 'mongodb':
        const { default: ProductosDaoMongoDb } = await import("../models/daos/productos/productosDaoMongoDb.js")
        const { default : CarritosDaoMongoDb } = await import("../models/daos/carritos/carritosDaoMongoDb.js")
        productosDao = new ProductosDaoMongoDb();
        carritosDao = new CarritosDaoMongoDb();
        break;
    case 'firebase':
        const { default : ProductosDaoFirebase } = await import("../models/daos/productos/productosDaoFirebase.js")
        const { default : CarritosDaoFirebase } = await import("../models/daos/carritos/carritosDaoFirebase.js")
        productosDao = new ProductosDaoFirebase();
        carritosDao = new CarritosDaoFirebase();
        break;
    default:
        productosDao = new ProductosDaoMemoria();
        carritosDao = new CarritosDaoMemoria();
        break;
}