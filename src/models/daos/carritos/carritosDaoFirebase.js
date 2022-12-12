import ContenedorFirebase from "../../contenedores/contenedorFirebase.js";


export default class CarritosDaoFirebase extends ContenedorFirebase{
    constructor(){
        super('orders')
    }
}