import ContenedorMemoria from "../../contenedores/contenedorMemoria.js";


export const DB_PRODUCTOS = [];

export default class ProductosDaoMemoria extends ContenedorMemoria{
    constructor(){
        super( DB_PRODUCTOS );
    }
}