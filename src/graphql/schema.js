import { buildSchema } from 'graphql';

const schema = new buildSchema(
    `
        input ProductoInput{
            name: String,
            categoria: String,
            price: String,
            img: String
        }
        type Carrito {
            id: String,
            productos: Producto
        }
        type Producto {
            id: String,
            name: String,
            categoria: String,
            price: String,
            img: String
        }

        type Query{
            consultaProductos: [Producto]
            consultaProducto(id: String): Producto
            consultaCarritos: [Carrito]
        }
        type Mutation{
            agregarProducto(datos: ProductoInput): Producto
            actualizarProducto(id: String, datos: ProductoInput): Producto
            eliminarProducto(id: String): Producto
        }
    `
)
export default schema;