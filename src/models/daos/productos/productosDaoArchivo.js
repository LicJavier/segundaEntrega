import ContenedorArchivo from "../../contenedores/contenedorArchivo.js";

export default class ProductosDaoArchivo extends ContenedorArchivo{
    constructor(){
        super('./DB/productos.json');
    }
}