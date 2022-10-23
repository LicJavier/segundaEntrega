import ContenedorMongoDb from "../contenedores/contenedorMongoDb.js";
import { usuarioSchema } from "../models/usuarios.model.js";

export default class UsuarioDaoMongoDb extends ContenedorMongoDb{
    constructor(){
        super( 'usuario' , usuarioSchema )
    }
}
