
export default class ContenedorMemoria{
    constructor ( DB ){
        this.DB = DB;
    }
    async listarTodo(){
        try {
        const DATABASE = await this.DB;
        console.log( this.DB )
        return DATABASE ;
        } catch ( error ) {
        console.log( error )
        }
    }
    async listar( id ){
        try {
            const objeto = await this.DB.filter( e => e.id == id );
            return objeto
        } catch (error) {
            console.log( error )
        }
    }
    async guardar( objeto ){
        try {
            const listarTodo = await this.listarTodo();
            let idNuevo; 
            listarTodo.length == 0 ? idNuevo = 0 : idNuevo =listarTodo.length;
            const objetoNuevo = { id : idNuevo , ...objeto };
            this.DB.push( objetoNuevo )
            return objetoNuevo;
        } catch ( error ) {
            console.log( error )
        }
    }
    async actualizar( objeto , id ){
        try {
            await this.eliminar( id )
            const objetoActualizado = { id : id , ...objeto };
            this.DB.push(objetoActualizado);
            return objetoActualizado;
        } catch (error) {
            console.log( error )
        }
    }
    async eliminar( id ){
        const eliminable = await this.DB.findIndex( e => e.id == id );
        this.DB.splice( eliminable , 1 );
        return eliminable;
    }
}