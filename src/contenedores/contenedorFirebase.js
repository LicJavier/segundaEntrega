import admin from 'firebase-admin'
import config from '../utils/config.js';


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
            console.log('Consulta realizada', response.data())
            return response.data()
        } catch ( error ) {
            console.log( error )
        }
    }
    async listarTodo(){
        try {
            let response = await this.coleccion.get();
            let docRes = response.docs.map((doc)=>({
                id: doc.id,
                nombre: doc.data()
            }))
            console.log('Documentos recuperados', docRes);
            return docRes;
        } catch ( error ) {
            console.log( error )
        }
    }
    async guardar( objeto ){
        try {
            const res = await this.coleccion.add( objeto ); 
            return res;
        } catch ( error ) {
            console.log( error )
        }
    }
    async actualizar( id , objeto ){
        try {
            const res = await this.coleccion.doc( id ).set( objeto );
            return res;
        } catch ( error ) {
            console.log( error )
        }
    }
    async eliminar( id ){
        try {
            const res = await this.coleccion.doc( id ).delete();
            return res;
        } catch ( error ) {
            console.log( error )
        }
    }
}