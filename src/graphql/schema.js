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
            id: ID!,
            name: String,
            categoria: String,
            price: String,
            img: String
        }

        type Query{
            consultaProductos: [Producto]
            consultaProducto(id: ID!): Producto
            consultaCarritos: [Carrito]
        }
        type Mutation{
            agregarProducto(datos: ProductoInput): Producto
            actualizarProducto(id: ID!, datos: ProductoInput): Producto
            eliminarProducto(id: ID!): Producto
        }
    `
)
export default schema;