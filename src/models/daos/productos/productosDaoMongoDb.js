import ContenedorMongoDb from "../../contenedores/contenedorMongoDb.js";
import { productoSchema } from "../../productos.model.js";

export default class ProductosDaoMongoDb extends ContenedorMongoDb{
    constructor(){
        super( 'productos' , productoSchema )
    }
}