import { productosDao , carritosDao } from "../utils/index.js";

export async function consultaProducto({id}) {
    return await productosDao.listar(id) 
}
export async function consultaProductos() {
    return await productosDao.listarTodo() 
}
export async function consultaCarritos() {
    return await carritosDao.listarTodo() 
}
export async function agregarProducto({object}){
    return await productosDao.guardar(object) 
}
export async function actualizarProducto({id} , {object}){
    return await productosDao.actualizar(id, object) 
}
export async function eliminarProducto({id}){
    return await productosDao.eliminar(id) 
}