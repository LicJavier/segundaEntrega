import ContenedorMongoDb from "../../contenedores/contenedorMongoDb.js";
import { carritosSchema } from "../../models/carritos.model.js";

export default class CarritosDaoMongoDb extends ContenedorMongoDb{
    constructor(){
        super( 'carritos' , carritosSchema )
    }
}