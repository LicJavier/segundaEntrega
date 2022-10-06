import ContenedorFirebase from "../../contenedores/contenedorFirebase.js";
import { normalize, schema } from "normalizr";

//----------------------------------------------------------------------------------------------
//------------------------------NORMALIZACION---------------------------------------------------
//----------------------------------------------------------------------------------------------

const authorSchema = new schema.Entity( 'author' , {} , {idAttribute: 'id' });
const textoSchema = new schema.Entity('texto' , { author: authorSchema } , { idAttribute: 'id' } );
const postSchema = new schema.Entity('posts', { post: [textoSchema] } , { idAttribute: 'id' } )

const normalizedData = (mensajes)=> normalize( mensajes , postSchema );

export default class MensajesDaoFirebase extends ContenedorFirebase{
    constructor(){
        super('mensajes')
    }

    async listarTodoNormalizado(){
        const msj = await this.listarTodo();
        const normalizados =  normalizedData({ id : 'mensajes' , msj , postSchema })
        return normalizados;
    }
}