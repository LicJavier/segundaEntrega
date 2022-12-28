import supertest from "supertest";
import { expect } from "chai";
import { app } from "../server.js";

let request
let server

describe('Test de integración de tareas', () =>{
    before(async function(){
        server = await startServer()
        request = supertest(`http://localhost:${server.address().port}/api/productos`)
        console.log("\n*****************COMIENZO TOTAL DEL TEST*********************")
    })

    beforeEach(function(){
        console.log("\n****************COMIENZO DEL TEST*******************")
    })

    describe('listado de los productos', () => {
        it('Debería retornar un status 200', async () => {
            const response = await request.get('/');
            expect(response.status).to.eql(200);
        })
        it('Debería listar objetos', async ()=>{
            const response = await request.get('/');
            expect(response).to.be.a('object');
        })
    })
    
    describe('Listado de un producto', async () =>{
        const response = await request.get('/63964d39200731d08c669daf');
        expect(response).to.eql(200)
        expect(response).to.be.a('object')
    })

    describe('Guardado de un producto a través de POST en mongoDB Atlas', () => {
        it('Debería obtener un 201 por el guardado', async () => {
            const producto = await generar()
            const response = await request.post('/').send(producto)
            expect(response.status).to.eql(201)
        })
        it('El producto guardado debe incluir las propiedades del objeto', async () =>{
            const producto = await generar()
            const response = await request.post('/').send(producto)
            const product = response.body
            console.log(product)
            expect(product).to.have.property('name')
            expect(product).to.have.property('stock')
            expect(product).to.have.property('price')
            expect(product).to.have.property('img')
        })
    })

    describe('Actualización de producto', () => {
        it('Debería actualizar el producto', async () =>{
            const producto = await generar2()
            const response = await request.put('/63a91808bdfef412c177932c').send(producto)
            expect(response.status).to.eql(201)
        })
    })

    describe('Eliminación de producto', async () => {
        it('Debería eliminar un producto por el id', async () =>{
            const response = await request.delete('/63ac530b40e486a03be63983')
            expect(response.status).to.eql(202)
        })
    })

    afterEach(function(){
        console.log("\n***************EL TEST SE AH COMPLETADO****************")
    })
    after(function () {
        server.close()
        console.log("\n****************FIN TOTAL DEL TEST*******************")
    })
})

async function startServer() {
    return new Promise((resolve, reject) => {
        const PORT = 0
        const server = app.listen(PORT, () => {
            console.log(`Servidor express escuchando en el puerto ${server.address().port}`);
            resolve(server)
        });
        server.on('error', error => {
            console.log(`Error en Servidor: ${error}`)
            reject(error)
        });
    })
}
async function generar() {
    const producto = {
        name: 'PRODUCTO FAKE',
        price: 9999,
        categoria: "mandala" ,
        img: 'https://creaciones-natu.vercel.app/images/buho.jpeg',
        stock: 0
    }
    return producto
}
async function generar2() {
    const producto = {
        name: 'PRODUCTO FAKE MODIFICADO',
        price: 999999,
        categoria: "mandala" ,
        img: 'https://creaciones-natu.vercel.app/images/buho.jpeg',
        stock: 0
    }
    return producto
}