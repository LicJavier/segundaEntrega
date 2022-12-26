import ProductoDto from "./productos.dtos.js";
import NewError from "./NewError.class.js";
import logger from "../config/logger.config.js";

export default class ProductoFactory{
    constructor(dao){
        this.dao = dao;
    }

    async listar( id ){
        try {
            const dto = await this.dao.listar(id)
            const result = new ProductoDto(dto)
            return result;
        } catch (error) {
            const cuserr = new NewError(500, 'Error al listar()', error);
            logger.error(cuserr);
        }
    }
    async listarTodo(){
        try {
            const dtos = await this.dao.listarTodo();
            return dtos.map(dto=> new ProductoDto(dto)); 
        } catch (error) {
            const cuserr = new NewError(500, 'Error al listarTodo()', error);
            logger.error(cuserr);
        }
    }
    async guardar( objeto ){
        try {
            const dto = new ProductoDto( objeto )
            return await this.dao.guardar(dto);
        } catch (error) {
            const cuserr = new NewError(500, 'Error al guardar()', error);
            logger.error(cuserr);
        }
    }
    async actualizar( id , objeto ){
            try {
                const dto = new ProductoDto( objeto );
                const doc = await this.dao.actualizar( id , dto );
            return doc;
        } catch (error) {
            const cuserr = new NewError(500, 'Error al actualizar()', error);
            logger.error(cuserr);
        }
    }
}
