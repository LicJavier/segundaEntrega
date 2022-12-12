import admin from 'firebase-admin'
import config from '../../config/config.js';
import logger from '../../config/logger.config.js';


//Se concecta
admin.initializeApp({
    credential: admin.credential.cert(config.firebase)
});

const db = admin.firestore();

export default class ContenedorFirebase{
    constructor( coleccion ){
        this.coleccion = db.collection(coleccion);
    }
    
    async listar( id ){
        try {
            let doc = this.coleccion.doc(`${id}`);
            const response = await doc.get();
            logger.info('Consulta realizada', response.data())
            return response.data()
        } catch ( error ) {
            logger.error(error) 
        }
    }
    async listarTodo(){
        try {
            let response = await this.coleccion.get();
            let docRes = response.docs.map((doc)=>({
                id: doc.id,
                nombre: doc.data()
            }))
            logger.info('Documentos recuperados', docRes);
            return docRes;
        } catch ( error ) {
            logger.error(error) 
        }
    }
    async guardar( objeto ){
        try {
            const res = await this.coleccion.add( objeto ); 
            return res;
        } catch ( error ) {
            logger.error(error) 
        }
    }
    async actualizar( id , objeto ){
        try {
            const res = await this.coleccion.doc( id ).set( objeto );
            return res;
        } catch ( error ) {
            logger.error(error) 
        }
    }
    async eliminar( id ){
        try {
            const res = await this.coleccion.doc( id ).delete();
            return res;
        } catch ( error ) {
            logger.error(error) 
        }
    }
}