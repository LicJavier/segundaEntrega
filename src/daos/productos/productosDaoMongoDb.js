import ContenedorMongoDb from "../../contenedores/contenedorMongoDb.js";
import { productoSchema } from "../../models/productos.model.js";

export default class ProductosDaoMongoDb extends ContenedorMongoDb{
    constructor(){
        super( 'productos' , productoSchema )
    }
}