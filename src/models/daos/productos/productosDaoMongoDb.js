import logger from "../../../config/logger.config.js";
import ContenedorMongoDb from "../../contenedores/contenedorMongoDb.js";
import { productoSchema } from "../../productos.model.js";

export default class ProductosDaoMongoDb extends ContenedorMongoDb{
    constructor(){
        super( 'productos' , productoSchema )
    }
    async listarProducto( id ){
        try {
            logger.info(id)
            return this.coleccion.findOne( { id2 : id } );
        } catch (error) {
            logger.error(error)
        }
    }
}