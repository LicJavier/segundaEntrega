import ContenedorMemoria from "../../contenedores/contenedorMemoria.js";


export let DB_PRODUCTOS = [];

export default class ProductosDaoMemoria extends ContenedorMemoria{
    constructor(){
        super( DB_PRODUCTOS );
    }
    eliminarTodo(){
        this.DB = [];
    }
}