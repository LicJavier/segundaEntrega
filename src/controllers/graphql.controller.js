import axios from "axios";

async function listarTodoAxios() {
    const res = await axios.post("http://localhost:8080/graphql",
        { "query":"query {consultaProductos {name,id,price,img}}" },
        [{
            headers: {
                "Content-Type": "application/json"
            }
    }])
    return res.data;
}

async function listarAxios(id) {
    const res = await axios.post("http://localhost:8080/graphql",
        { "query":`query {consultaProducto{id: ${id}} {name,id,price,img}}` },
        [{
            headers: {
                "Content-Type": "application/json"
            }
    }])
    return res.data;
}

async function agregarAxios(object) {
    const res = await axios.post("http://localhost:8080/graphql",
        { "query":`mutation {agregarProducto{datos: {name:${object.name}, price:${object.price}, img:${object.img}, categoria:${object.categoria}}} {name,id,price,img}}` },
        [{
            headers: {
                "Content-Type": "application/json"
            }
    }])
    return res.data;
}

async function actualizarAxios( id , object ) {
    const res = await axios.post("http://localhost:8080/graphql",
        { "query":`mutation {actualizarProducto{datos: {name:${object.name}, price:${object.price}, img:${object.img}, categoria:${object.categoria}}} {name,id,price,img}}` },
        [{
            headers: {
                "Content-Type": "application/json"
            }
    }])
    return res.data;
}

async function eliminarAxios(id) {
    const res = await axios.post("http://localhost:8080/graphql",
        { "query":`query {eliminarProducto{id: ${id}} {name,id}}` },
        [{
            headers: {
                "Content-Type": "application/json"
            }
    }])
    return res.data;
}

export async function listarTodo( req , res ) {
        try {
            const result = await listarTodoAxios();
            const productos = result.data.consultaProductos;
            res.render('home', { productos })
        } catch (error) {
            console.log(error)
        }
}

export async function listarProducto( req , res ) {
    try {        
        const id = req.params.id
        const result = await listarAxios(id);
        const productId = result.data.consultaProducto;
        res.status(201).json({Producto : productId})
    } catch (error) {
        console.log(error)
    }
}
export async function guardarProducto( req , res ) {
        try {        
            let objeto = req.body;
            let productoNuevo = await agregarAxios( objeto );
            res.status(201).json(productoNuevo);
        } catch (error) {
            logger.error(error)
        }
}

export async function actualizarProducto( req , res ) {
    try {
        const id = req.params.id;
        const body = req.body;
        const result = await actualizarAxios( id , body )
        let productId = result.data.actualizarProducto
        res.status(201).json(productId);
    } catch (error) {
        logger.error(error)
    }
}

export async function eliminarProducto( req , res ) {
    try {
        let id = req.params.id;
        const result = await eliminarAxios(id); 
        let productId = result.data.eliminarProducto;
        res.status(202).json( { "producto eliminado": productId } );  
    } catch (error) {
        logger.error(error)
    }
}