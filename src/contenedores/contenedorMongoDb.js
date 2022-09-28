import mongoose from "mongoose";
import config from '../utils/config.js'



const strConn = config.mongodb.atlas.strConn;
await mongoose.connect(strConn);

export default class ContenedorMongoDb{
    
    constructor( cuerpoColeccion , esquema ){
        this.coleccion = mongoose.model( cuerpoColeccion , esquema )
    }
    async listar( id ){
        try {
            return this.coleccion.find( { _id: id } )
        } catch (error) {
            console.log(error)
        }
    }
    async listarTodo(){
        try {
            return this.coleccion.find( {} )
        } catch (error) {
            console.log(error)
        }
    }
    async guardar( objeto ){
        try {
            return this.coleccion.create( objeto )
        } catch (error) {
            
        }
    }
    async actualizar( id , objeto ){
        try {
            return this.coleccion.findOneAndUpdate( { _id: id } , { $set : objeto } )
        } catch (error) {
            console.log(error)
        }
    }
    async eliminar( id ){
        try {
            return this.coleccion.deleteOne( { _id: id } )
        } catch (error) {
            console.log(error)
        }
    }
}