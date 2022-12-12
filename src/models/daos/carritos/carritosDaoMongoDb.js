import ContenedorMongoDb from "../../contenedores/contenedorMongoDb.js";
import { carritosSchema } from "../../carritos.model.js";

export default class CarritosDaoMongoDb extends ContenedorMongoDb{
    constructor(){
        super( 'carritos' , carritosSchema )
    }
}