import ContenedorFirebase from "../../contenedores/contenedorFirebase.js";

export default class ProductosDaoFirebase extends ContenedorFirebase{
    constructor(){
        super('productos')
    }
    
}