import {promises as fs} from 'fs';

export default class ContenedorArchivo{
    constructor(ruta){
        this.ruta = ruta;
    }
    async listarTodo(){
        try {
            const objetos = await fs.readFile(this.ruta, 'utf-8' );
            return JSON.parse(objetos);
        } catch (error) {
            console.log(error);
            return [];   
        }
    };
    async guardar(object){
        try {
            const guardar = await this.listarTodo();
            let idNuevo = 0 
            guardar.length == 0 ? idNuevo = 1 : idNuevo = guardar[guardar.length - 1 ].id + 1;
            const objetoNuevo = {id: idNuevo, ...object};
            guardar.push(objetoNuevo);
            await fs.writeFile(this.ruta, JSON.stringify(guardar, null,2))
            return objetoNuevo;
        } catch (error) {
            return [];
        }
    }
    async listar(Number){
        try {
            const guardar = await this.listarTodo();
            let nuevoObjeto = guardar.filter( elemento => elemento.id == Number);
            return nuevoObjeto;
        } catch (error) {
            return [];
        }
    };
    
    async eliminar(Number){
        try {
            const elementos = await this.listarTodo();
            const borrarElemento = elementos.findIndex(elemento=> elemento.id == Number);
            borrarElemento == -1
            ? console.log("No se encontro el elemento") 
            : elementos.splice(borrarElemento,1)
            await fs.writeFile(this.ruta, JSON.stringify(elementos, null,2))
            return (`Objeto ${Number} eliminado`)
        } catch (error) {
            
        }
    };
    async actualizar(object , id){
        try {
            const guardar = await this.listarTodo();
            guardar.splice(guardar.findIndex(e=>e.id==id),1)
            const objetoNuevo = {id: id, ...object};
            guardar.push(objetoNuevo);
            await fs.writeFile(this.ruta, JSON.stringify(guardar, null,2))
            return objetoNuevo;
        } catch (error) {
            return [];
        }
    };
}