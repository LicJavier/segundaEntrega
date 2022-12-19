import mongoose from "mongoose";
import MongoDBClient from "../../classes/MongoDBClient.class.js";
import NewError from "../../classes/NewError.class.js";
import config from '../../config/config.js'
import logger from "../../config/logger.config.js";
import { asPOJO, renameField } from "../../utils/object.js";

const strConn = config.mongodb.atlas.strConn;
await mongoose.connect(strConn);

export default class ContenedorMongoDb{
    
    constructor( cuerpoColeccion , esquema ){
        this.coleccion = mongoose.model( cuerpoColeccion , esquema )
        this.conn = new MongoDBClient;
    }
    async listar( id ){
            let doc = [];
            try {
                await this.conn.connect();
                doc = await this.coleccion.find( { _id: id } ).lean();
                const result = renameField(asPOJO(doc[0]), '_id', "id")
                return result;
            } catch (error) {
                const cuserr = new NewError(500, 'Error al listar()', error);
                logger.error(cuserr);
            } finally{
                this.conn.disconnect();
                logger.info(`Elemento listado ${doc[0].name}`)
            }
    }
    async listarTodo(){
        let docs = [];
            try {
                await this.conn.connect();
                docs = await this.coleccion.find( {}, {__v:0} ).lean();
                docs = docs.map(asPOJO);
                docs = docs.map(element => renameField( element , '_id' , 'id' ))
            return docs; 
        } catch (error) {
            const cuserr = new NewError(500, 'Error al listarTodo()', error);
            logger.error(cuserr);
        } finally{
            this.conn.disconnect();
            logger.info(`Elementos listados ${docs.length}`)
        }
    }
    async guardar( objeto ){
        let doc = [];
            try {
                await this.conn.connect();
                doc = await this.coleccion.create( objeto );
            return doc;
        } catch (error) {
            const cuserr = new NewError(500, 'Error al guardar()', error);
            logger.error(cuserr);
        } finally{
            this.conn.disconnect();
            logger.info(`Elemento guardado ${doc}`)
        }
    }
    async actualizar( id , objeto ){
        let doc = [];
            try {
                await this.conn.connect();
                doc = await this.coleccion.findOneAndUpdate( { _id: id } , { $set : objeto } );
            return doc;
        } catch (error) {
            const cuserr = new NewError(500, 'Error al actualizar()', error);
            logger.error(cuserr);
        } finally{
            this.conn.disconnect();
            logger.info(`Elemento actualizado ${doc}`)
        }
    }
    async eliminar( id ){
        let doc = [];
            try {
                await this.conn.connect();
                doc = await this.coleccion.deleteOne( { _id: id } );
            return doc
        } catch (error) {
            const cuserr = new NewError(500, 'Error al eliminar()', error);
            logger.error(cuserr);
        } finally{
            this.conn.disconnect();
            logger.info(`Elemento eliminado ${doc.name}`)
        }
    }
}