import ContenedorArchivo from "../../contenedores/contenedorArchivo.js";


class CarritosDaoArchivo extends ContenedorArchivo{

    constructor(){
        super('./DB/carritos.json');
    }
}

export default CarritosDaoArchivo