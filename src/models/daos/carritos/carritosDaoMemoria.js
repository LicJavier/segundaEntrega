import ContenedorMemoria from "../../contenedores/contenedorMemoria.js";

export const DB_CARRITO = [];

export default class CarritosDaoMemoria extends ContenedorMemoria{
    constructor(){
        super(DB_CARRITO);
        
    }
    eliminarTodo(){
        this.DB = [];
    }
}